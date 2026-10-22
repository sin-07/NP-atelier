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
    threshold = 0.08,
    rootMargin = '0px 0px -30px 0px',
    y = 30,
    yOffset,
    scale = 0.98,
    duration = 0.65,
    stagger = 0.09,
    delay = 0,
    targetSelector,
    selector,
  } = options

  const resolvedY = yOffset ?? y
  const resolvedSelector = selector || targetSelector || '.gsap-reveal-item'

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          observer.disconnect()

          const targets = resolvedSelector
            ? node.querySelectorAll(resolvedSelector)
            : [node]

          if (targets && targets.length > 0) {
            gsap.fromTo(
              targets,
              { opacity: 0, y: resolvedY, scale },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration,
                stagger,
                delay,
                ease: 'power3.out',
                clearProps: 'transform',
              }
            )
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold, rootMargin, resolvedY, scale, duration, stagger, delay, resolvedSelector])

  return { containerRef, ref: containerRef }
}
