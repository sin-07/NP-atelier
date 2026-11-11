"use client"

import React from 'react'

interface NpMonogramSvgProps {
  className?: string
}

/**
 * Custom vector calligraphy mark matching the tall, looped, high-contrast "NP"
 * lettering from the NP Atelier brand medallion.
 */
export function NpMonogramSvg({ className = 'h-6 w-auto' }: NpMonogramSvgProps) {
  return (
    <svg
      viewBox="0 0 112 60"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* N entry scroll + rising hairline to peak */}
      <path d="M31.8 25.4c1.9-2.2 2.4-5.7 1.1-8.8-1.3-3.1-4.8-5.1-9.3-5.1-7.4 0-14.2 5.4-17.6 13.7-3.4 8.2-2 17.5 3.6 22.1 4.2 3.5 10.6 3.7 16.5.2 4.3-2.5 8.5-7.4 13.1-13.1l26.6-28.5c1.1-1.2 2.4-1.8 1.6-2.2-.8-.4-2.1.4-3.4 1.8L37.5 33.4c-4.7 5.5-8.9 10-12.9 12.1-4.9 2.6-9.8 2.4-12.9-.4-4.2-3.7-5-11.2-2-18.3 2.8-6.8 8.3-11.3 14.2-11.3 3.4 0 5.9 1.6 6.8 4 .9 2.4.3 5-1.1 6.3-.6.5-.5 1.3.1 1.6.7.3 1.4 0 2.1-2z" />

      {/* N shaded diagonal downstroke + rising hairline connector toward P */}
      <path d="M67.2 3.6c-.9-.2-1.8.4-2.5 1.4-3.2 4.9-6.9 12.1-10.3 20.9-3.2 8.2-6 16.5-7.7 22.8-.4 1.4.5 2.4 1.8 1.7 4.7-2.6 10.5-10 16.1-19.2 4.4-7.2 8.7-14.8 13.6-20.1.7-.7.2-1.7-.8-1.4-1.1.3-2.4 1.4-3.5 2.8-4.5 5.4-8.8 12.7-12.9 19.6-4.7 7.8-9.2 13.6-12 15.8 1.6-5.7 4.2-13 7.2-20.5 3.2-8.1 6.8-15 10.2-19.9 1-1.5 1.8-3.6.8-3.9z" />

      {/* P tall tilted calligraphy stem + crossing upper loop */}
      <path d="M89.2 9.4c-1.3-.3-2.5.4-3.3 1.8-4.2 7-8.7 16.3-13.2 26.8-3.5 8.1-6.5 14.3-7.8 16.3-.4.6.1 1.3.8 1.2 1.2-.2 2.4-.9 3.2-2.2 2-3.1 4.9-9.1 8.1-16.5 4.2-9.6 8.3-18.1 12.2-24.6.7-1.1.9-2.5 0-2.8z" />
      <path d="M77.4 10.3c2.4-2 6-3.1 10.3-3.5 7-.6 13.8 1.3 16.5 5.9 2.6 4.4 1.3 11.4-3.3 17.5-4.7 6.3-12 10.2-19.9 9.7-4.5-.3-8.6-2-11.2-4.8-.7-.8-1.7-.2-1.1.8 2.7 4.1 7.6 6.4 13.3 6.5 9 .1 17.5-4.6 22.7-11.9 5.3-7.5 6.4-15.9 2.7-21.3-3.6-5.2-11.4-7.4-19.7-6.4-4.8.6-9 2.4-11.6 5-.8.8-.3 1.8.3 2.5z" />
    </svg>
  )
}

interface AtelierScriptTextProps {
  children: React.ReactNode
  className?: string
}

/**
 * Renders handwritten signature calligraphy matching the "Atelier" lettering.
 */
export function AtelierScriptText({ children, className = '' }: AtelierScriptTextProps) {
  return (
    <span
      className={`font-script font-normal tracking-[-0.015em] leading-[0.95] normal-case ${className}`}
    >
      {children}
    </span>
  )
}

interface BrandTitleProps {
  siteName?: string
  showNpMark?: boolean
  svgClassName?: string
  atelierClassName?: string
  fallbackClassName?: string
  className?: string
}

/**
 * Preserves existing siteName string ("NP Atelier") while applying the exact
 * "NP" calligraphic SVG mark + "Atelier" handwritten signature typography.
 */
export function BrandTitle({
  siteName = 'NP Atelier',
  showNpMark = true,
  svgClassName = 'h-[19px] sm:h-[23px] w-auto text-[#141210]',
  atelierClassName = 'text-[26px] sm:text-[32px] text-[#141210]',
  fallbackClassName = 'font-script text-2xl sm:text-3xl text-[#141210] normal-case',
  className = '',
}: BrandTitleProps) {
  const normalized = (siteName || 'NP Atelier').trim()
  const isDefaultPair = /^np\s+atelier$/i.test(normalized)

  if (isDefaultPair) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 leading-none ${className}`}>
        <span className="sr-only">{normalized}</span>
        {showNpMark && (
          <NpMonogramSvg
            className={`${svgClassName} shrink-0 translate-y-[2px]`}
          />
        )}
        <AtelierScriptText className={atelierClassName}>
          Atelier
        </AtelierScriptText>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-baseline leading-none ${fallbackClassName} ${className}`}>
      {normalized}
    </span>
  )
}

