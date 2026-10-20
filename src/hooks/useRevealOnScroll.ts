import { useEffect, useRef, useState } from 'react'

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
