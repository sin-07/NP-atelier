/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -10px rgba(20, 20, 20, 0.06)',
        lift: '0 16px 36px -12px rgba(20, 20, 20, 0.10)',
        glow: '0 0 24px rgba(20, 20, 20, 0.08)',
        'glow-gold': '0 0 28px rgba(212, 175, 55, 0.35)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.28)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.40)',
        'gold-card': '0 12px 36px -10px rgba(184, 134, 11, 0.16), 0 0 0 1px rgba(212, 175, 55, 0.35)',
        'gold-card-hover': '0 20px 48px -12px rgba(184, 134, 11, 0.25), 0 0 24px rgba(212, 175, 55, 0.35)',
        'glow-emerald': '0 0 20px rgba(20, 20, 20, 0.06)',
        glass: '0 10px 30px 0 rgba(20, 20, 20, 0.04)',
        dropdown: '0 20px 40px -10px rgba(20, 20, 20, 0.12)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
      },
      colors: {
        cream: '#FAF7F2',
        sand: '#F3EFE8',
        obsidian: '#141414',
        blossom: '#EAE5DC',
        blush: '#B8860B',
        lilac: '#E4DFD6',
        sky: '#8C827A',
        mint: '#F6F3EE',
        peach: '#E8E2D8',
        gold: {
          50: '#FDFBF5',
          100: '#FAF4E3',
          200: '#F4E7C4',
          300: '#EBD498',
          400: '#DFBE6C',
          500: '#D4AF37', // True radiant metallic gold
          600: '#B8860B', // Dark golden rod
          700: '#946B08',
          800: '#735206',
          900: '#4E3604',
          light: '#FAF4E3',
          DEFAULT: '#D4AF37',
          dark: '#946B08',
          glow: '#F2D785',
        },
        amber: {
          DEFAULT: '#B8860B',
          glow: '#F4E5BD',
        },
        clay: {
          DEFAULT: '#7A6B5D',
          hover: '#5A4E43',
          light: '#F5F1EB',
        },
        moss: {
          DEFAULT: '#6E6659',
          light: '#E5DFD5',
        },
        cocoa: {
          DEFAULT: '#1A1A1A',
          soft: '#2D2A26',
          muted: '#6E6860',
          light: '#F7F5F0',
        },
      },
      backgroundImage: {
        paper:
          'linear-gradient(145deg, #FFFFFF 0%, #FAF8F5 100%)',
        texture:
          'radial-gradient(circle at 1px 1px, rgba(40, 35, 30, 0.04) 1px, transparent 0)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 247, 235, 0.92) 100%)',
        'gold-metallic':
          'linear-gradient(135deg, #ECC872 0%, #D4AF37 35%, #B8860B 70%, #F5DE98 100%)',
        'gold-soft':
          'linear-gradient(150deg, #FFFDF8 0%, #FAF5E8 50%, #F5ECCF 100%)',
        'terracotta-gradient':
          'linear-gradient(135deg, #FAF7F2 0%, #D8CFC2 100%)',
        'gold-gradient':
          'linear-gradient(135deg, #2B210B 0%, #171103 100%)',
        'soft-glow':
          'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -6px, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale3d(1, 1, 1)' },
          '50%': { opacity: '1', transform: 'scale3d(1.03, 1.03, 1)' },
        },
        shimmer: {
          '100%': { transform: 'translate3d(100%, 0, 0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0%, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}