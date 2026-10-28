"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 320
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev))
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#1A140B] to-[#0D0A05] text-[#F2D785] shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-colors duration-150 hover:border-[#D4AF37] hover:bg-[#2A1E0E] hover:text-[#FFF5D1] hover:shadow-[0_4px_25px_rgba(212,175,55,0.55)] cursor-pointer transform-gpu hover:will-change-transform"
        >
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
