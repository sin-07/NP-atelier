/* eslint-disable react-refresh/only-export-components */

import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans, Cinzel } from 'next/font/google'
import '../index.css'
import { MarketplaceProvider } from '../context/MarketplaceContext'
import Preloader from '../components/Preloader'
import GlobalPageTransitionHandler from '../components/GlobalPageTransitionHandler'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700'],
})

export const viewport: Viewport = {
  themeColor: '#0B0B0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'NP Atelier | Luxury Handmade Crafts & Exotic Aquarium Marketplace',
  description:
    'Discover genuine artisan handmade jewelry, pressed floral resin, clean aromatherapy soy candles, alongside exotic captive-bred fish, rimless nature aquariums, aquatic plants, and equipment.',
  keywords: [
    'handmade crafts',
    'fish and aquarium',
    'live freshwater fish',
    'rimless aquariums',
    'aquascaping plants',
    'artisan jewelry',
    'resin decor',
    'soy candles',
    'custom gifts',
    'craft marketplace',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${cinzel.variable}`}
    >
      <body className="font-sans antialiased bg-[#0B0B0A] text-[#F5EBDD] selection:bg-[#D4AF78]/30 selection:text-[#F5EBDD]">
        <MarketplaceProvider>
          <Preloader />
          <GlobalPageTransitionHandler />
          {children}
        </MarketplaceProvider>
      </body>
    </html>
  )
}

