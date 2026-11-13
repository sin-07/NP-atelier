"use client"

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Navbar from './Navbar'
import Hero from './Hero'
import HandmadeGallery from './HandmadeGallery'
import AcquarioTropicale from './AcquarioTropicale'
import Footer from './Footer'
import ToastContainer from './ToastContainer'
import BackToTop from './BackToTop'
import MobileBottomDock from './MobileBottomDock'
import { useMarketplace } from '../context/MarketplaceContext'

// Dynamically imported below-the-fold sections to minimize initial client JS bundle
const ArtisanSpotlight = dynamic(() => import('./ArtisanSpotlight'))
const Testimonials = dynamic(() => import('./Testimonials'))
const FaqSection = dynamic(() => import('./FaqSection'))
const Newsletter = dynamic(() => import('./Newsletter'))

const pageSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 48 : -48,
    opacity: 0,
    filter: 'blur(2px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 28 },
      opacity: { duration: 0.22, ease: 'easeOut' },
      filter: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? -48 : 48,
    opacity: 0,
    filter: 'blur(2px)',
    transition: {
      x: { duration: 0.16, ease: 'easeIn' },
      opacity: { duration: 0.14, ease: 'easeIn' },
      filter: { duration: 0.14 },
    },
  }),
}

export default function HomePage() {
  const { activeDepartment, isAquaticTheme } = useMarketplace()
  const isAquariumView = activeDepartment === 'aquarium'

  const [slideDirection, setSlideDirection] = useState<number>(0)
  const prevViewRef = useRef<boolean>(isAquariumView)

  useEffect(() => {
    if (prevViewRef.current !== isAquariumView) {
      setSlideDirection(isAquariumView ? 1 : -1)
      prevViewRef.current = isAquariumView
    }
  }, [isAquariumView])

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-200 ${
        isAquaticTheme
          ? 'bg-[#F0F7FC] text-[#0A2540] selection:bg-[#E11D48]/20 selection:text-[#0A2540]'
          : 'selection:bg-[#D4AF37]/30 selection:text-[#382606]'
      }`}
    >
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow with Horizontal Slider Transition */}
      <main className="pt-28 sm:pt-32 pb-24 sm:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          {isAquariumView ? (
            <motion.div
              key="page-aquarium"
              custom={slideDirection}
              variants={pageSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full will-change-transform"
            >
              <AcquarioTropicale />
            </motion.div>
          ) : (
            <motion.div
              key="page-crafts"
              custom={slideDirection}
              variants={pageSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full will-change-transform"
            >
              <Hero />
              <HandmadeGallery />
              <div id="makers">
                <ArtisanSpotlight />
              </div>
              <Testimonials />
              <FaqSection />
              <Newsletter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom Dock */}
      <MobileBottomDock />

      {/* Back to Top & WhatsApp Stack */}
      <BackToTop />
    </div>
  )
}
