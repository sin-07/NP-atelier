"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { WhatsAppIcon } from './Icons'

export default function BackToTop() {
  const { isAquaticTheme, branding } = useMarketplace()
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

  const rawDigits = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '')
  const waPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits || '919341297124'
  const waText = encodeURIComponent(
    isAquaticTheme
      ? 'Hi Acquario Tropicale, I would like to inquire about tropical fish, plants, or rimless tanks!'
      : 'Hi NP Atelier, I have an inquiry about your handmade crafts & custom orders!'
  )
  const waHref = `https://wa.me/${waPhone}?text=${waText}`

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end gap-2.5 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition-colors duration-150 cursor-pointer transform-gpu ${
              isAquaticTheme
                ? 'border-sky-300/80 bg-white/95 text-[#0369A1] shadow-[0_6px_20px_rgba(3,105,161,0.18)] hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                : 'border-[#D4AF37]/50 bg-gradient-to-br from-[#1A140B] to-[#0D0A05] text-[#F2D785] shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:border-[#D4AF37] hover:bg-[#2A1E0E] hover:text-[#FFF5D1] hover:shadow-[0_4px_25px_rgba(212,175,55,0.55)]'
            }`}
          >
            <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Official WhatsApp Quick-Chat Icon */}
      <motion.a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="pointer-events-auto group relative flex items-center"
      >
        {/* Desktop hover label pill */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 mr-2.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-md border opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap ${
            isAquaticTheme
              ? 'bg-white text-[#0A2540] border-emerald-400/60'
              : 'bg-[#1A140B] text-[#FFF5D1] border-[#D4AF37]/40'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
          Chat on WhatsApp
        </span>

        {/* Official WhatsApp Circle Button */}
        <span className="relative flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] via-[#20BD5A] to-[#128C7E] text-white shadow-[0_8px_24px_rgba(37,211,102,0.42)] ring-2 ring-white/90 transition-shadow duration-200 group-hover:shadow-[0_10px_28px_rgba(37,211,102,0.58)]">
          <WhatsAppIcon className="h-6 w-6 drop-shadow-xs" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-white" />
          </span>
        </span>
      </motion.a>
    </div>
  )
}
