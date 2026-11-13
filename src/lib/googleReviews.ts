export type GoogleReviewSource = 'google_places' | 'featurable' | 'google_import'

export interface GoogleReviewItem {
  id: string
  author: string
  authorMeta?: string
  avatar?: string
  rating: number
  relativeTime: string
  publishedAt?: string
  text: string
  profileUrl?: string
  source: GoogleReviewSource
}

export interface GoogleTopicBadge {
  label: string
  count: number
}

export interface GoogleReviewsConfig {
  placeName: string
  rating: number
  totalReviews: number
  mapsUrl: string
  placeId?: string
  featurableWidgetId?: string
  highlightTopics: GoogleTopicBadge[]
  reviews: GoogleReviewItem[]
  lastSyncedAt?: string
  syncSource?: 'featurable' | 'google_places' | 'saved'
}

export const DEFAULT_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=NP+Atelier+Bhootnath+Road+Patna'

/**
 * Initial verified Google Business snapshot provided directly from the owner's
 * Google Maps listing (5.0★ across 12 reviews). Live sync providers merge
 * automatically on top of this verified baseline without duplicating entries.
 */
export const DEFAULT_GOOGLE_REVIEWS: GoogleReviewsConfig = {
  placeName: 'NP Atelier',
  rating: 5.0,
  totalReviews: 12,
  mapsUrl: DEFAULT_GOOGLE_MAPS_URL,
  placeId: '',
  featurableWidgetId: '',
  highlightTopics: [
    { label: 'products', count: 8 },
    { label: 'memorable', count: 2 },
  ],
  reviews: [
    {
      id: 'google-rafat-ali',
      author: 'RAFAT ALI',
      authorMeta: '2 reviews · 2 photos',
      rating: 5,
      relativeTime: '2 months ago',
      text: 'Excellent 🌠 this product .... 💗 quality was awesome this product ( 10/10 ) 👌 ✨ , I like this product .... 😍 it is great money for value .. 🤗 🤩 💗 ...',
      source: 'google_import',
    },
  ],
  syncSource: 'saved',
}

/** Validate safe Place ID format before passing into outbound Places API URLs. */
export function sanitizePlaceId(value?: string | null): string {
  if (!value) return ''
  const trimmed = value.trim()
  // Extract Place ID if a Google Maps URL with query_place_id or ChIJ token was pasted
  const chijMatch = trimmed.match(/\b(ChIJ[a-zA-Z0-9_-]{10,80})\b/)
  if (chijMatch) return chijMatch[1]
  return /^[a-zA-Z0-9_-]{8,120}$/.test(trimmed) ? trimmed : ''
}

/** Validate safe Featurable Widget ID (UUID or slug) before building external fetch URL. */
export function sanitizeWidgetId(value?: string | null): string {
  if (!value) return ''
  const trimmed = value.trim()
  // Also accept full Featurable widget/API URLs cleanly
  const urlMatch = trimmed.match(/widgets\/([a-zA-Z0-9_-]{6,80})/)
  const candidate = urlMatch ? urlMatch[1] : trimmed
  return /^[a-zA-Z0-9_-]{6,80}$/.test(candidate) ? candidate : ''
}

export function withDefaultGoogleReviews(
  incoming?: Partial<GoogleReviewsConfig> | null
): GoogleReviewsConfig {
  const base = DEFAULT_GOOGLE_REVIEWS
  if (!incoming) {
    return {
      ...base,
      highlightTopics: [...base.highlightTopics],
      reviews: [...base.reviews],
    }
  }
  const hasReviewsArray = Array.isArray(incoming.reviews) && incoming.reviews.length > 0
  const hasTopicsArray = Array.isArray(incoming.highlightTopics) && incoming.highlightTopics.length > 0
  return {
    placeName: incoming.placeName || base.placeName,
    rating: typeof incoming.rating === 'number' && incoming.rating > 0 ? incoming.rating : base.rating,
    totalReviews:
      typeof incoming.totalReviews === 'number' && incoming.totalReviews > 0
        ? incoming.totalReviews
        : base.totalReviews,
    mapsUrl: incoming.mapsUrl || base.mapsUrl,
    placeId: sanitizePlaceId(incoming.placeId) || '',
    featurableWidgetId: sanitizeWidgetId(incoming.featurableWidgetId) || '',
    highlightTopics: hasTopicsArray ? incoming.highlightTopics! : [...base.highlightTopics],
    reviews: hasReviewsArray ? incoming.reviews! : [...base.reviews],
    lastSyncedAt: incoming.lastSyncedAt || base.lastSyncedAt,
    syncSource: incoming.syncSource || base.syncSource,
  }
}

function normalizeKey(review: Pick<GoogleReviewItem, 'author' | 'text'>): string {
  const cleanAuthor = (review.author || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const cleanSnippet = (review.text || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 64)
  return `${cleanAuthor}::${cleanSnippet}`
}

/**
 * Merges incoming reviews ahead of existing persisted reviews without losing
 * historical entries (important when Google Places caps live output at 5).
 */
export function mergeGoogleReviews(
  incoming: GoogleReviewItem[],
  existing: GoogleReviewItem[]
): GoogleReviewItem[] {
  const seen = new Set<string>()
  const merged: GoogleReviewItem[] = []

  for (const item of [...incoming, ...existing]) {
    if (!item || !item.author?.trim()) continue
    const normalizedItem: GoogleReviewItem = {
      ...item,
      id: item.id || `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: item.author.trim(),
      rating: Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5))),
      relativeTime: item.relativeTime?.trim() || 'Verified on Google',
      text: (item.text || '').trim(),
    }
    const key = normalizeKey(normalizedItem)
    const authorOnlyKey = `${normalizedItem.author.toLowerCase()}::`
    if (seen.has(key)) continue
    // If we already captured text for this author, skip empty-comment duplicates
    if (!normalizedItem.text && Array.from(seen).some((k) => k.startsWith(authorOnlyKey))) {
      continue
    }
    seen.add(key)
    merged.push(normalizedItem)
  }

  return merged
}

export function starEnumToNumber(star: unknown): number {
  if (typeof star === 'number' && !Number.isNaN(star)) return Math.min(5, Math.max(1, Math.round(star)))
  const s = String(star || '').toUpperCase().trim()
  if (s === 'FIVE' || s === '5') return 5
  if (s === 'FOUR' || s === '4') return 4
  if (s === 'THREE' || s === '3') return 3
  if (s === 'TWO' || s === '2') return 2
  if (s === 'ONE' || s === '1') return 1
  const digit = Number(s.replace(/[^0-9.]/g, ''))
  return digit >= 1 && digit <= 5 ? Math.round(digit) : 5
}

export function formatRelativeTimeFromIso(iso?: string): string {
  if (!iso) return 'Verified on Google'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Verified on Google'
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.floor(diffDays / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

const RELATIVE_TIME_LINE_RE =
  /^(just now|yesterday|a day ago|\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago|(a|an)\s+(second|minute|hour|day|week|month|year)\s+ago)(\s+on\s+google)?$/i

const UI_NOISE_LINE_RE =
  /^(overview|reviews|about|write a review|sort|all|like|share|more|report review|helpful\??|new|translated by google|see original|show more|read more|\.\.\.|[1-5]|5\.0|12 reviews|\d+\s+reviews?)$/i

function isMetaLine(line: string): boolean {
  return /^(local guide|(\d+\s+reviews?)(\s*[·•]\s*\d+\s+photos?)?)$/i.test(line.trim()) ||
    /local guide\s*[·•]/i.test(line) ||
    /\d+\s+reviews?(\s*[·•]\s*\d+\s+photos?)?/i.test(line)
}

function tryParseJsonReviews(raw: string): GoogleReviewItem[] | null {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null
  try {
    const parsed = JSON.parse(trimmed)
    const list: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.reviews)
        ? parsed.reviews
        : Array.isArray(parsed?.widget?.reviews)
          ? parsed.widget.reviews
          : []
    if (list.length === 0) return null
    return list
      .map((item, idx) => {
        const author =
          item.author ||
          item.reviewer?.displayName ||
          item.reviewer?.name ||
          item.authorAttribution?.displayName ||
          item.name ||
          ''
        if (!author) return null
        const text =
          item.text?.text ||
          item.text ||
          item.comment ||
          item.originalText?.text ||
          ''
        const publishedAt = item.createTime || item.publishTime || item.publishedAt
        return {
          id: item.id || item.reviewId || `json-review-${idx}-${author.toLowerCase().replace(/\W+/g, '')}`,
          author: String(author).trim(),
          authorMeta: item.authorMeta || (item.reviewer?.isAnonymous ? 'Verified Customer' : undefined),
          avatar: item.avatar || item.reviewer?.profilePhotoUrl || item.authorAttribution?.photoUri,
          rating: starEnumToNumber(item.starRating ?? item.rating),
          relativeTime:
            item.relativeTime ||
            item.relativePublishTimeDescription ||
            formatRelativeTimeFromIso(publishedAt),
          publishedAt,
          text: String(text || '').trim(),
          profileUrl: item.profileUrl || item.authorAttribution?.uri,
          source: 'google_import' as const,
        }
      })
      .filter(Boolean) as GoogleReviewItem[]
  } catch {
    return null
  }
}

/**
 * Parses either exported JSON (Google Takeout `reviews.json` / Featurable) or a single
 * `Ctrl+A` / `Ctrl+C` raw text paste from Google Maps / Google Business Profile.
 */
export function parseGoogleReviewsInput(rawInput: string): GoogleReviewItem[] {
  const fromJson = tryParseJsonReviews(rawInput)
  if (fromJson && fromJson.length > 0) return fromJson

  const lines = rawInput
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !UI_NOISE_LINE_RE.test(l) && !/^[★☆⭐\s]+$/.test(l))

  const dateIndices: number[] = []
  lines.forEach((line, idx) => {
    if (RELATIVE_TIME_LINE_RE.test(line)) dateIndices.push(idx)
  })

  if (dateIndices.length === 0) return []

  const extracted: GoogleReviewItem[] = []
  for (let i = 0; i < dateIndices.length; i++) {
    const dateIdx = dateIndices[i]
    const prevDateIdx = i > 0 ? dateIndices[i - 1] : -1
    const nextDateIdx = i + 1 < dateIndices.length ? dateIndices[i + 1] : lines.length

    // Header lines immediately before date line: either [author] or [author, meta]
    let authorLine = ''
    let metaLine = ''
    const c1 = dateIdx - 1 > prevDateIdx ? lines[dateIdx - 1] : ''
    const c2 = dateIdx - 2 > prevDateIdx ? lines[dateIdx - 2] : ''

    if (c1 && isMetaLine(c1)) {
      metaLine = c1
      if (c2 && !isMetaLine(c2)) authorLine = c2
    } else if (c1) {
      authorLine = c1
    }

    if (!authorLine) continue

    // Determine where next review header begins so we stop before its author/meta lines
    let bodyEndIdx = nextDateIdx
    if (i + 1 < dateIndices.length) {
      const nextPrev1 = lines[nextDateIdx - 1]
      const nextPrev2 = lines[nextDateIdx - 2]
      if (nextPrev1 && isMetaLine(nextPrev1) && nextPrev2) {
        bodyEndIdx = nextDateIdx - 2
      } else {
        bodyEndIdx = nextDateIdx - 1
      }
    }

    const bodyLines: string[] = []
    for (let k = dateIdx + 1; k < bodyEndIdx; k++) {
      const l = lines[k]
      if (/^response from the owner/i.test(l)) break
      bodyLines.push(l)
    }

    const relativeTime = lines[dateIdx].replace(/\s+on\s+google$/i, '').trim()
    const cleanText = bodyLines.join(' ').trim()
    extracted.push({
      id: `paste-${authorLine.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      author: authorLine,
      authorMeta: metaLine || undefined,
      rating: 5,
      relativeTime,
      text: cleanText || 'Rated 5 stars on Google',
      source: 'google_import',
    })
  }

  return extracted
}

