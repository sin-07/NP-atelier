import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '../../../lib/serverDb'
import {
  formatRelativeTimeFromIso,
  GoogleReviewItem,
  GoogleReviewsConfig,
  mergeGoogleReviews,
  parseGoogleReviewsInput,
  sanitizePlaceId,
  sanitizeWidgetId,
  starEnumToNumber,
  withDefaultGoogleReviews,
} from '../../../lib/googleReviews'

const SYNC_TTL_MS = 60 * 60 * 1000 // Re-sync automatically at most once per hour

interface LiveFetchResult {
  reviews: GoogleReviewItem[]
  rating?: number
  totalReviews?: number
  placeName?: string
  mapsUrl?: string
  placeId?: string
  syncSource: 'featurable' | 'google_places'
}

function mapFeaturableReview(r: any, idx: number): GoogleReviewItem | null {
  const author =
    r?.reviewer?.displayName || r?.reviewer?.name || r?.author || r?.authorName || ''
  if (!author) return null
  const text = r?.comment || r?.text || ''
  const publishedAt = r?.createTime || r?.publishedAt || r?.updateTime
  return {
    id: r?.reviewId || r?.id || `feat-${author.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
    author: String(author).trim(),
    authorMeta: r?.reviewer?.isAnonymous ? 'Verified Customer' : 'Verified Google Review',
    avatar: r?.reviewer?.profilePhotoUrl || r?.avatar || r?.profilePhotoUrl,
    rating: starEnumToNumber(r?.starRating ?? r?.rating),
    relativeTime: r?.relativeTime || formatRelativeTimeFromIso(publishedAt),
    publishedAt,
    text: String(text).trim() || 'Rated 5 stars on Google',
    source: 'featurable',
  }
}

async function fetchFromFeaturable(widgetId: string): Promise<LiveFetchResult | null> {
  const endpoints = [
    `https://featurable.com/api/v1/widgets/${widgetId}`,
    `https://featurable.com/api/v2/widgets/${widgetId}`,
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const rawReviews: any[] = Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray(data?.widget?.reviews)
          ? data.widget.reviews
          : []
      const mapped = rawReviews
        .map((r, i) => mapFeaturableReview(r, i))
        .filter(Boolean) as GoogleReviewItem[]

      const rating =
        Number(data?.averageRating ?? data?.widget?.averageRating ?? data?.rating) || undefined
      const totalReviews =
        Number(data?.totalReviewCount ?? data?.widget?.totalReviewCount ?? data?.totalReviews) ||
        (mapped.length > 0 ? mapped.length : undefined)

      if (mapped.length > 0 || rating) {
        return {
          reviews: mapped,
          rating,
          totalReviews,
          syncSource: 'featurable',
        }
      }
    } catch {
      // Try next schema endpoint or fallback gracefully
    }
  }
  return null
}

async function resolvePlaceIdFromApi(apiKey: string, query: string): Promise<string> {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName',
      },
      body: JSON.stringify({ textQuery: query }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const data = await res.json()
    return sanitizePlaceId(data?.places?.[0]?.id)
  } catch {
    return ''
  }
}

async function fetchFromGooglePlaces(
  apiKey: string,
  initialPlaceId: string,
  placeNameQuery: string
): Promise<LiveFetchResult | null> {
  try {
    const placeId = initialPlaceId || (await resolvePlaceIdFromApi(apiKey, placeNameQuery))
    if (!placeId) return null

    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()

    const mapped = (Array.isArray(data?.reviews) ? data.reviews : [])
      .map((r: any, idx: number): GoogleReviewItem | null => {
        const author = r?.authorAttribution?.displayName || ''
        if (!author) return null
        return {
          id: r?.name || `gp-${author.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
          author: String(author).trim(),
          authorMeta: 'Verified Google Review',
          avatar: r?.authorAttribution?.photoUri,
          profileUrl: r?.authorAttribution?.uri,
          rating: starEnumToNumber(r?.rating),
          relativeTime:
            r?.relativePublishTimeDescription || formatRelativeTimeFromIso(r?.publishTime),
          publishedAt: r?.publishTime,
          text: String(r?.text?.text || r?.originalText?.text || '').trim() || 'Rated 5 stars on Google',
          source: 'google_places',
        }
      })
      .filter(Boolean) as GoogleReviewItem[]

    return {
      reviews: mapped,
      rating: typeof data?.rating === 'number' ? data.rating : undefined,
      totalReviews: typeof data?.userRatingCount === 'number' ? data.userRatingCount : undefined,
      placeName: data?.displayName?.text,
      mapsUrl: data?.googleMapsUri,
      placeId,
      syncSource: 'google_places',
    }
  } catch {
    return null
  }
}

async function runAutomaticSync(
  currentConfig: GoogleReviewsConfig,
  forceRefresh: boolean
): Promise<{ config: GoogleReviewsConfig; synced: boolean; provider: string }> {
  const widgetId = sanitizeWidgetId(
    process.env.FEATURABLE_WIDGET_ID || currentConfig.featurableWidgetId
  )
  const placesApiKey = (process.env.GOOGLE_PLACES_API_KEY || '').trim()
  const placeId = sanitizePlaceId(process.env.GOOGLE_PLACE_ID || currentConfig.placeId)

  const hasLiveProvider = Boolean(widgetId || placesApiKey)
  if (!hasLiveProvider) {
    return { config: currentConfig, synced: false, provider: 'saved' }
  }

  const lastSyncMs = currentConfig.lastSyncedAt ? Date.parse(currentConfig.lastSyncedAt) : 0
  const isStale = !lastSyncMs || Number.isNaN(lastSyncMs) || Date.now() - lastSyncMs > SYNC_TTL_MS

  if (!forceRefresh && !isStale) {
    return {
      config: currentConfig,
      synced: false,
      provider: currentConfig.syncSource || 'saved',
    }
  }

  let live: LiveFetchResult | null = null
  if (widgetId) {
    live = await fetchFromFeaturable(widgetId)
  }
  if (!live && placesApiKey) {
    live = await fetchFromGooglePlaces(
      placesApiKey,
      placeId,
      `${currentConfig.placeName || 'NP Atelier'} Bhootnath Road Patna`
    )
  }

  if (!live) {
    return { config: currentConfig, synced: false, provider: 'saved' }
  }

  const mergedReviews = mergeGoogleReviews(live.reviews, currentConfig.reviews)
  const updatedConfig = withDefaultGoogleReviews({
    ...currentConfig,
    placeName: live.placeName || currentConfig.placeName,
    rating: live.rating || currentConfig.rating,
    totalReviews: Math.max(live.totalReviews || 0, mergedReviews.length, currentConfig.totalReviews),
    mapsUrl: live.mapsUrl || currentConfig.mapsUrl,
    placeId: live.placeId || currentConfig.placeId,
    reviews: mergedReviews,
    lastSyncedAt: new Date().toISOString(),
    syncSource: live.syncSource,
  })

  await saveSettings({ googleReviews: updatedConfig })
  return { config: updatedConfig, synced: true, provider: live.syncSource }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const forceRefresh = url.searchParams.get('refresh') === '1'
    const settings = await getSettings()
    const current = withDefaultGoogleReviews(settings.googleReviews)
    const { config, synced, provider } = await runAutomaticSync(current, forceRefresh)

    return NextResponse.json(
      {
        success: true,
        config,
        synced,
        provider,
        autoSyncConfigured: Boolean(
          sanitizeWidgetId(process.env.FEATURABLE_WIDGET_ID || config.featurableWidgetId) ||
            (process.env.GOOGLE_PLACES_API_KEY || '').trim()
        ),
        hasPlacesApiKey: Boolean((process.env.GOOGLE_PLACES_API_KEY || '').trim()),
      },
      {
        headers: {
          'Cache-Control': forceRefresh
            ? 'no-store'
            : 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const settings = await getSettings()
    const current = withDefaultGoogleReviews(settings.googleReviews)

    if (body.action === 'import_raw') {
      const parsed = parseGoogleReviewsInput(String(body.rawText || ''))
      if (parsed.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Could not detect review blocks in pasted text. Paste copied reviews from Google Maps / Business Profile or Google Takeout reviews.json.',
          },
          { status: 400 }
        )
      }
      const merged = mergeGoogleReviews(parsed, current.reviews)
      const updated = withDefaultGoogleReviews({
        ...current,
        mapsUrl: typeof body.mapsUrl === 'string' && body.mapsUrl.trim() ? body.mapsUrl.trim() : current.mapsUrl,
        totalReviews: Math.max(current.totalReviews, merged.length),
        reviews: merged,
        lastSyncedAt: new Date().toISOString(),
        syncSource: 'saved',
      })
      await saveSettings({ googleReviews: updated })
      return NextResponse.json({
        success: true,
        importedCount: parsed.length,
        config: updated,
      })
    }

    if (body.action === 'delete_review' && body.reviewId) {
      const filtered = current.reviews.filter((r) => r.id !== body.reviewId)
      const updated = withDefaultGoogleReviews({
        ...current,
        reviews: filtered,
      })
      await saveSettings({ googleReviews: updated })
      return NextResponse.json({ success: true, config: updated })
    }

    // Default / 'sync_config': save config & attempt immediate live sync
    const nextConfig = withDefaultGoogleReviews({
      ...current,
      featurableWidgetId:
        body.featurableWidgetId !== undefined
          ? sanitizeWidgetId(body.featurableWidgetId)
          : current.featurableWidgetId,
      placeId:
        body.placeId !== undefined
          ? sanitizePlaceId(body.placeId)
          : body.mapsUrl
            ? sanitizePlaceId(body.mapsUrl) || current.placeId
            : current.placeId,
      mapsUrl:
        typeof body.mapsUrl === 'string' && body.mapsUrl.trim()
          ? body.mapsUrl.trim()
          : current.mapsUrl,
      rating: typeof body.rating === 'number' && body.rating > 0 ? body.rating : current.rating,
      totalReviews:
        typeof body.totalReviews === 'number' && body.totalReviews > 0
          ? body.totalReviews
          : current.totalReviews,
    })

    await saveSettings({ googleReviews: nextConfig })
    const { config, synced, provider } = await runAutomaticSync(nextConfig, true)

    return NextResponse.json({
      success: true,
      config,
      synced,
      provider,
      autoSyncConfigured: Boolean(
        sanitizeWidgetId(process.env.FEATURABLE_WIDGET_ID || config.featurableWidgetId) ||
          (process.env.GOOGLE_PLACES_API_KEY || '').trim()
      ),
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

