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
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
})

export const viewport: Viewport = {
  themeColor: '#0E0C09',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-[#F8F5F0] text-[#1A1A1A] selection:bg-[#D4AF37]/25 selection:text-[#382606]">
        <MarketplaceProvider>
          <Preloader />
          <GlobalPageTransitionHandler />
          {children}
        </MarketplaceProvider>
      </body>
    </html>
  )
}

