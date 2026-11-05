/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: false },
      { source: '/shop', destination: '/#collection', permanent: false },
      { source: '/gallery', destination: '/#collection', permanent: false },
      { source: '/collection', destination: '/#collection', permanent: false },
      { source: '/customize', destination: '/#customize', permanent: false },
      { source: '/custom-studio', destination: '/#customize', permanent: false },
      { source: '/makers', destination: '/#makers', permanent: false },
      { source: '/about', destination: '/#about', permanent: false },
      { source: '/contact', destination: '/#contact', permanent: false },
      { source: '/events', destination: '/#collection', permanent: false },
    ]
  },
}

export default nextConfig

