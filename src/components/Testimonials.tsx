"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  RefreshCw,
  Star,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import {
  DEFAULT_GOOGLE_REVIEWS,
  GoogleReviewItem,
  GoogleReviewsConfig,
  withDefaultGoogleReviews,
} from '../lib/googleReviews'
import { useGsapReveal } from '../hooks/useGsapReveal'

function GoogleMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.22 1.18-3.24 0-5.99-2.19-6.97-5.14H1.02v3.14C3.03 21.15 7.21 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.03 14.03a7.2 7.2 0 0 1 0-4.06V6.83H1.02a12 12 0 0 0 0 10.34l4.01-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.83c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.03 2.85 1.02 6.83l4.01 3.14C6.01 7.02 8.76 4.83 12 4.83Z"
      />
    </svg>
  )
}

function ReviewAvatar({ review }: { review: GoogleReviewItem }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = review.author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')

  if (review.avatar && !imgFailed) {
    return (
      <img
        src={review.avatar}
        alt={review.author}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setImgFailed(true)}
        className="h-11 w-11 shrink-0 rounded-full border border-[#B8925A]/70 object-cover shadow-sm"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#B8925A]/55 bg-gradient-to-br from-[#F3E6CE] to-[#DFC597] text-xs font-bold tracking-wide text-[#3D2C14] shadow-sm"
    >
      {initials || 'G'}
    </div>
  )
}

export default function Testimonials() {
  const { branding } = useMarketplace()
  const [liveConfig, setLiveConfig] = useState<GoogleReviewsConfig>(() =>
    withDefaultGoogleReviews(branding?.googleReviews)
  )
  const [autoSyncActive, setAutoSyncActive] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const { containerRef } = useGsapReveal({
    selector: '.gsap-testimonial-item',
    stagger: 0.04,
    yOffset: 12,
    duration: 0.35,
  })

  // Keep synced with Branding context updates immediately (e.g., after Admin import)
  useEffect(() => {
    if (branding?.googleReviews) {
      setLiveConfig(withDefaultGoogleReviews(branding.googleReviews))
    }
  }, [branding?.googleReviews])

  // Background automatic Google Reviews sync (server refreshes hourly when configured)
  useEffect(() => {
    let active = true
    fetch('/api/google-reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.success || !data?.config) return
        setLiveConfig(withDefaultGoogleReviews(data.config))
        setAutoSyncActive(Boolean(data.autoSyncConfigured))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const config = liveConfig || DEFAULT_GOOGLE_REVIEWS
  const reviews = config.reviews || []
  const visibleReviews = useMemo(
    () => (showAllReviews ? reviews : reviews.slice(0, 6)),
    [reviews, showAllReviews]
  )

  return (
    <section id="about" ref={containerRef} className="section-shell py-14 sm:py-20 scroll-mt-24">
      <div className="space-y-8 sm:space-y-10">
        {/* Section Heading */}
        <div className="gsap-testimonial-item mx-auto max-w-2xl text-center">
          <span className="section-eyebrow inline-flex items-center gap-1.5">
            <GoogleMark className="h-3.5 w-3.5" />
            <span>Verified Google Reviews</span>
          </span>
          <h2 className="heading-1 mt-3.5">
            Rated <span className="italic font-normal text-gold-gradient">{config.rating.toFixed(1)} ★</span> by Our Collectors
          </h2>
          <p className="body-lead mx-auto mt-3 max-w-2xl text-[#524436]">
            Authentic customer feedback from <strong className="font-semibold text-[#141210]">{config.placeName}</strong> on Google Maps across India.
          </p>
        </div>

        {/* Google Business Profile Summary Bento Header */}
        <div className="gsap-testimonial-item rounded-[2rem] border border-[#8C6D46]/30 bg-gradient-to-br from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] p-5 sm:p-7 shadow-[0_12px_32px_rgba(72,54,30,0.09)]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#8C6D46]/25 bg-white shadow-sm">
                  <GoogleMark className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tagline text-3xl font-bold text-[#141210]">
                      {config.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5 text-[#D97706]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#D97706]" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-[#5C4D3C] whitespace-nowrap">
                    Based on <span className="font-bold text-[#141210]">{config.totalReviews} Google Reviews</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:border-l md:border-[#8C6D46]/20 md:pl-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 whitespace-nowrap">
                  {autoSyncActive ? (
                    <>
                      <RefreshCw className="h-3 w-3" />
                      <span>Auto-Synced Live with Google</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified Google Business Listing</span>
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#8C6D46]/25 bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#5C4D3C] whitespace-nowrap">
                  <MapPin className="h-3 w-3 text-[#8C6838]" />
                  <span>Bhootnath Rd, Patna</span>
                </span>
                {config.highlightTopics?.map((topic) => (
                  <span
                    key={topic.label}
                    className="rounded-full border border-[#8C6D46]/20 bg-[#EFE8DC] px-2.5 py-1 text-[11px] font-bold text-[#6D522D] whitespace-nowrap"
                  >
                    {topic.label} ({topic.count})
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#8C6D46]/35 bg-white px-5 py-2.5 text-xs font-bold text-[#141210] shadow-xs transition hover:border-[#8C6838] hover:bg-[#FAF6EE]"
              >
                <GoogleMark className="h-3.5 w-3.5" />
                <span>View All {config.totalReviews} on Google</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#7A5B32]" />
              </a>
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-5 py-2.5 text-xs font-bold shadow-[0_6px_18px_rgba(182,141,82,0.25)]"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Write a Review</span>
              </a>
            </div>
          </div>
        </div>

        {/* Verified Google Review Cards Grid */}
        <div
          className={`grid gap-6 ${
            visibleReviews.length === 1
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-[2rem] border border-[#8C6D46]/25 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] p-6 sm:p-7 shadow-[0_8px_24px_rgba(72,54,30,0.08)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#B8925A] hover:shadow-[0_16px_36px_rgba(72,54,30,0.14)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5 text-[#D97706]">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#D97706]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8C6D46]/25 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#5C4D3C] shadow-xs">
                    <GoogleMark className="h-3 w-3" />
                    <span>Google Review</span>
                  </span>
                </div>

                <p className="mt-4 font-tagline text-lg sm:text-xl italic leading-relaxed text-[#141210]">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#8C6D46]/20 pt-4">
                <div className="flex items-center gap-3">
                  <ReviewAvatar review={review} />
                  <div>
                    <h4 className="font-tagline font-bold text-base text-[#141210]">
                      {review.author}
                    </h4>
                    <p className="text-[11px] font-medium text-[#5C4D3C]">
                      {review.authorMeta || 'Verified Google Customer'}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-[#8C6D46]/20 bg-[#EFE8DC] px-2.5 py-1 text-[10px] font-bold text-[#5C4D3C]">
                  {review.relativeTime}
                </span>
              </div>
            </article>
          ))}

          {/* Balanced companion card when more reviews live on Google than locally synced yet */}
          {reviews.length < config.totalReviews && reviews.length === 1 && (
            <article className="flex flex-col justify-between rounded-[2rem] border border-dashed border-[#8C6D46]/40 bg-gradient-to-br from-white via-[#FAF6EE] to-[#EFE8DC]/70 p-6 sm:p-7 shadow-[0_8px_24px_rgba(72,54,30,0.06)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8C6D46]/30 bg-white px-3 py-1 text-[11px] font-bold text-[#7A5B32]">
                    <GoogleMark className="h-3.5 w-3.5" />
                    <span>{config.totalReviews - reviews.length}+ More on Google Maps</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">100% 5-Star Record</span>
                </div>

                <h3 className="font-tagline text-2xl font-bold text-[#141210]">
                  {config.totalReviews} Verified 5.0★ Reviews on Google
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#5C4D3C]">
                  Patrons most frequently praise product quality, craftsmanship, and value for money across our Google Maps listing. Read every customer story directly on Google or connect auto-sync from Admin.
                </p>

                {config.highlightTopics?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {config.highlightTopics.map((t) => (
                      <span
                        key={t.label}
                        className="rounded-full border border-[#8C6D46]/25 bg-white px-3 py-1 text-[11px] font-bold text-[#5C4D3C]"
                      >
                        Top Mention: &ldquo;{t.label}&rdquo; ({t.count})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#8C6D46]/20 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={config.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A5B32] hover:text-[#141210] underline underline-offset-4 transition"
                >
                  <span>Open All {config.totalReviews} Reviews on Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <span className="text-[11px] font-medium text-[#5C4D3C]">
                  NP Atelier • Patna
                </span>
              </div>
            </article>
          )}
        </div>

        {/* Expand / Collapse button when > 6 synced Google reviews are present */}
        {reviews.length > 6 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllReviews((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#8C6D46]/35 bg-[#FCF9F4] px-6 py-2.5 text-xs font-bold text-[#141210] shadow-xs transition hover:border-[#8C6838] hover:bg-[#EFE8DC] cursor-pointer"
            >
              <span>
                {showAllReviews
                  ? 'Show Fewer Reviews'
                  : `Show All ${reviews.length} Synced Google Reviews`}
              </span>
              {showAllReviews ? (
                <ChevronUp className="h-4 w-4 text-[#7A5B32]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#7A5B32]" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
