"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export interface GsapRevealOptions {
  threshold?: number
  rootMargin?: string
  y?: number
  yOffset?: number
  scale?: number
  duration?: number
  stagger?: number
  delay?: number
  targetSelector?: string
  selector?: string
}

export function useGsapReveal<T extends HTMLElement = HTMLElement>(
  options: GsapRevealOptions = {}
) {
  const containerRef = useRef<T | null>(null)
  const hasAnimatedRef = useRef(false)

  const {
    threshold = 0.05,
    rootMargin = '0px 0px 120px 0px',
    y = 12,
    yOffset,
    duration = 0.35,
    stagger = 0.035,
    delay = 0,
    targetSelector,
    selector,
  } = options

  const resolvedY = yOffset !== undefined ? Math.min(yOffset, 14) : y
  const resolvedSelector = selector || targetSelector || '.gsap-reveal-item'

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof window === 'undefined') return

    let observer: IntersectionObserver | null = null

    const ctx = gsap.context(() => {
      // Check if element is already in view on mount (e.g. initial page load)
      const rect = node.getBoundingClientRect()
      const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isAlreadyVisible && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true
        const targets = resolvedSelector ? node.querySelectorAll(resolvedSelector) : [node]
        if (targets && targets.length > 0) {
          gsap.fromTo(
            targets,
            { opacity: 0, y: resolvedY },
            {
              opacity: 1,
              y: 0,
              duration: 0.32,
              stagger: 0.03,
              ease: 'power2.out',
              clearProps: 'all',
            }
          )
        }
        return
      }

      // Ahead-of-scroll observer (triggers 120px before user arrives for seamless smoothness)
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            observer?.disconnect()

            const targets = resolvedSelector
              ? node.querySelectorAll(resolvedSelector)
              : [node]

            if (targets && targets.length > 0) {
              gsap.fromTo(
                targets,
                { opacity: 0, y: resolvedY },
                {
                  opacity: 1,
                  y: 0,
                  duration,
                  stagger,
                  delay,
                  ease: 'power2.out',
                  clearProps: 'all',
                }
              )
            }
          }
        },
        { threshold, rootMargin }
      )

      observer.observe(node)
    }, containerRef)

    return () => {
      observer?.disconnect()
      ctx.revert()
    }
  }, [threshold, rootMargin, resolvedY, duration, stagger, delay, resolvedSelector])

  return { containerRef, ref: containerRef }
}
