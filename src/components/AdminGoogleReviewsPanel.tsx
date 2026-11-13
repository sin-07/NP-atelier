"use client"

import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ClipboardPaste,
  ExternalLink,
  RefreshCw,
  Star,
  Trash2,
  Wand2,
} from 'lucide-react'
import {
  DEFAULT_GOOGLE_REVIEWS,
  GoogleReviewsConfig,
  withDefaultGoogleReviews,
} from '../lib/googleReviews'

interface AdminGoogleReviewsPanelProps {
  initialConfig?: GoogleReviewsConfig
  onSynced?: (config: GoogleReviewsConfig) => void
  onNotify: (toast: { title: string; message: string; type?: 'success' | 'info' | 'warning' | 'error' }) => void
}

export default function AdminGoogleReviewsPanel({
  initialConfig,
  onSynced,
  onNotify,
}: AdminGoogleReviewsPanelProps) {
  const [config, setConfig] = useState<GoogleReviewsConfig>(() =>
    withDefaultGoogleReviews(initialConfig)
  )
  const [widgetId, setWidgetId] = useState(config.featurableWidgetId || '')
  const [placeId, setPlaceId] = useState(config.placeId || '')
  const [mapsUrl, setMapsUrl] = useState(config.mapsUrl || DEFAULT_GOOGLE_REVIEWS.mapsUrl)
  const [rawBulkText, setRawBulkText] = useState('')
  const [hasPlacesKey, setHasPlacesKey] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    fetch('/api/google-reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.success || !data?.config) return
        const next = withDefaultGoogleReviews(data.config)
        setConfig(next)
        setWidgetId(next.featurableWidgetId || '')
        setPlaceId(next.placeId || '')
        setMapsUrl(next.mapsUrl || DEFAULT_GOOGLE_REVIEWS.mapsUrl)
        setHasPlacesKey(Boolean(data.hasPlacesApiKey))
      })
      .catch(() => {})
  }, [])

  const applyUpdatedConfig = (nextRaw: GoogleReviewsConfig) => {
    const next = withDefaultGoogleReviews(nextRaw)
    setConfig(next)
    setWidgetId(next.featurableWidgetId || '')
    setPlaceId(next.placeId || '')
    setMapsUrl(next.mapsUrl || DEFAULT_GOOGLE_REVIEWS.mapsUrl)
    onSynced?.(next)
  }

  const handleSaveAndSync = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_config',
          featurableWidgetId: widgetId,
          placeId,
          mapsUrl,
        }),
      })
      const data = await res.json()
      if (!data?.success) {
        onNotify({
          title: 'Sync Error',
          message: data?.error || 'Could not update Google Reviews configuration.',
          type: 'error',
        })
        return
      }
      applyUpdatedConfig(data.config)
      onNotify({
        title: data.synced ? 'Live Sync Complete' : 'Google Settings Saved',
        message: data.synced
          ? `Synced ${data.config?.reviews?.length || 0} reviews automatically via ${data.provider === 'featurable' ? 'Featurable' : 'Google Places'}.`
          : widgetId || hasPlacesKey
            ? 'Settings saved. Live provider returned no new updates yet — check Widget ID / Place ID.'
            : 'Saved Google Maps link. Add a free Featurable Widget ID or GOOGLE_PLACES_API_KEY for automatic hourly sync.',
        type: data.synced ? 'success' : 'info',
      })
    } catch {
      onNotify({
        title: 'Network Error',
        message: 'Failed to reach /api/google-reviews.',
        type: 'error',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleBulkImport = async () => {
    if (!rawBulkText.trim()) return
    setIsImporting(true)
    try {
      const res = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import_raw',
          rawText: rawBulkText,
          mapsUrl,
        }),
      })
      const data = await res.json()
      if (!data?.success) {
        onNotify({
          title: 'Import Failed',
          message: data?.error || 'Could not extract reviews from pasted text.',
          type: 'warning',
        })
        return
      }
      applyUpdatedConfig(data.config)
      setRawBulkText('')
      onNotify({
        title: `Imported ${data.importedCount} Google Reviews`,
        message: `Your storefront now displays ${data.config?.reviews?.length || 0} verified Google reviews.`,
        type: 'success',
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    const res = await fetch('/api/google-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_review', reviewId }),
    })
    const data = await res.json()
    if (data?.success && data?.config) {
      applyUpdatedConfig(data.config)
      onNotify({
        title: 'Review Removed',
        message: 'Updated stored Google reviews list.',
        type: 'info',
      })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[rgba(122,91,50,0.2)] pb-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-[#B8860B] fill-[#F59E0B]" />
          <h4 className="font-tagline text-sm font-bold uppercase tracking-wider text-[#141210]">
            Google Reviews Auto-Sync
          </h4>
        </div>
        <span className="rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-2.5 py-0.5 text-[10px] font-bold text-[#7A5B32]">
          Tab 5 of 5
        </span>
      </div>

      {/* Status Banner */}
      <div className="rounded-2xl border border-[#8C6D46]/25 bg-[#F5F0E8] p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#141210]">
            {config.placeName} • {config.rating.toFixed(1)} ★ ({config.totalReviews} on Google Maps)
          </p>
          <p className="text-[11px] text-[#5C4D3C] mt-0.5">
            Currently synced on site: <strong>{config.reviews.length}</strong> review(s) •{' '}
            {config.syncSource === 'featurable'
              ? 'Auto-syncing live via Featurable (all reviews)'
              : config.syncSource === 'google_places'
                ? 'Auto-syncing live via Google Places API'
                : 'Ready to connect auto-sync below'}
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-[#8C6D46]/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#7A5B32] hover:bg-[#FAF6EF]"
        >
          <span>Open Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Automatic Hourly Sync Setup */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-[#141210] mb-1">
            Free Full Auto-Sync: Featurable Widget ID <span className="text-emerald-700">(Recommended — Syncs All 12+ Reviews)</span>
          </label>
          <input
            type="text"
            value={widgetId}
            onChange={(e) => setWidgetId(e.target.value)}
            placeholder="e.g. a1b2c3d4-... or featurable widget URL"
            className="h-10 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3 text-xs font-medium text-[#141210] outline-none focus:border-[#8C6834]"
          />
          <p className="mt-1 text-[11px] text-[#5C4D3C]">
            Create a free Google Reviews widget on{' '}
            <a
              href="https://featurable.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-[#7A5B32]"
            >
              featurable.com
            </a>{' '}
            (select NP Atelier) and paste its Widget ID above — all 12+ & future reviews sync automatically every hour.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#141210] mb-1">
              Google Maps Listing URL
            </label>
            <input
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="h-10 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3 text-xs font-medium text-[#141210] outline-none focus:border-[#8C6834]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#141210] mb-1">
              Google Place ID {hasPlacesKey ? '(API Key Active ✓)' : '(Optional)'}
            </label>
            <input
              type="text"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="ChIJ... (auto-detected if key set)"
              className="h-10 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3 text-xs font-medium text-[#141210] outline-none focus:border-[#8C6834]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAndSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 rounded-xl bg-[#141210] px-4 py-2.5 text-xs font-bold text-[#E5C18A] hover:bg-[#2A251F] disabled:opacity-60 transition cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing with Google...' : 'Save & Sync Live from Google'}</span>
        </button>
      </div>

      {/* Instant 1-Paste Bulk Extractor */}
      <div className="rounded-2xl border border-[rgba(122,91,50,0.24)] bg-[#FCF9F4] p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#141210]">
          <Wand2 className="h-4 w-4 text-[#7A5B32]" />
          <span>1-Paste Instant Importer (Google Maps Ctrl+A or reviews.json)</span>
        </div>
        <p className="text-[11px] text-[#5C4D3C] leading-relaxed">
          Open NP Atelier Reviews on Google Maps, scroll down once, press <kbd className="rounded bg-[#EFE8DC] px-1">Ctrl+A</kbd> then{' '}
          <kbd className="rounded bg-[#EFE8DC] px-1">Ctrl+C</kbd>, and paste everything here in one go (or paste Google Takeout{' '}
          <code>reviews.json</code>). All reviewers, dates, and text will be extracted automatically.
        </p>
        <textarea
          rows={3}
          value={rawBulkText}
          onChange={(e) => setRawBulkText(e.target.value)}
          placeholder="Paste full Google Maps Reviews text or Google Takeout JSON here..."
          className="w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-white p-3 text-xs text-[#141210] outline-none focus:border-[#8C6834]"
        />
        <button
          type="button"
          onClick={handleBulkImport}
          disabled={isImporting || !rawBulkText.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#8C6D46]/35 bg-[#EFE8DC] px-3.5 py-2 text-xs font-bold text-[#141210] hover:bg-[#E5D8C3] disabled:opacity-45 transition cursor-pointer"
        >
          <ClipboardPaste className="h-3.5 w-3.5 text-[#7A5B32]" />
          <span>{isImporting ? 'Extracting Reviews...' : 'Extract & Import All Reviews'}</span>
        </button>
      </div>

      {/* Stored Reviews Preview */}
      {config.reviews.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B32]">
            Stored Google Reviews ({config.reviews.length})
          </p>
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {config.reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[rgba(122,91,50,0.18)] bg-white p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <p className="text-xs font-bold text-[#141210] truncate">{rev.author}</p>
                    <span className="text-[10px] text-[#7A5B32]">{rev.relativeTime}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#5C4D3C] line-clamp-2">{rev.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(rev.id)}
                  title="Remove review"
                  className="rounded-lg p-1.5 text-rose-700/70 hover:bg-rose-50 hover:text-rose-800 shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

