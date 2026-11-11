/* eslint-disable react-refresh/only-export-components */

import type { Metadata, Viewport } from 'next'
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  Cinzel,
  Cormorant_Garamond,
  Allura,
} from 'next/font/google'
import '../index.css'
import { MarketplaceProvider } from '../context/MarketplaceContext'
import { UIModalProvider } from '../context/UIModalContext'
import GlobalPageTransitionHandler from '../components/GlobalPageTransitionHandler'
import GlobalModals from '../components/GlobalModals'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-tagline',
})

const allura = Allura({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-script',
})

export const viewport: Viewport = {
  themeColor: '#F5F0E8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'NP Atelier | Luxury Handmade Crafts & Exotic Aquarium Marketplace',
  description:
    'Discover genuine artisan handmade jewelry, pressed floral resin, clean aromatherapy soy candles, alongside exotic captive-bred fish, rimless nature aquariums, aquatic plants, and equipment.',
  icons: {
    icon: '/np-atelier-logo.jpg',
    apple: '/np-atelier-logo.jpg',
  },
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
      className={`${playfair.variable} ${jakarta.variable} ${cinzel.variable} ${cormorant.variable} ${allura.variable}`}
    >
      <body className="font-sans antialiased bg-[#F5F0E8] text-[#141210] selection:bg-[#D4AF78]/30 selection:text-[#141210]">
        <UIModalProvider>
          <MarketplaceProvider>
            <GlobalPageTransitionHandler />
            <GlobalModals />
            {children}
          </MarketplaceProvider>
        </UIModalProvider>
      </body>
    </html>
  )
}
