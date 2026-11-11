export const AQUARIUM_THEME_META_COLOR = '#051320'
export const CRAFTS_THEME_META_COLOR = '#F5F0E8'

export const AQUATIC_CONTACT_EMAIL = 'acquariotropicale2723@gmail.com'
export const CRAFT_CONTACT_EMAIL = 'npatelierindia@gmail.com'

export function isAquaticDepartment(dept?: string | null): boolean {
  return dept === 'aquarium'
}

export function getWorldContactEmail(isAquatic: boolean, configuredEmail?: string | null): string {
  return isAquatic ? AQUATIC_CONTACT_EMAIL : configuredEmail || CRAFT_CONTACT_EMAIL
}

export interface WorldModalTheme {
  backdrop: string
  card: string
  drawer: string
  header: string
  subHeader: string
  inset: string
  insetDashed: string
  well: string
  title: string
  body: string
  muted: string
  accentText: string
  greenBadge: string
  redBadge: string
  input: string
  closeBtn: string
  primaryCta: string
  secondaryCta: string
  activeTab: string
  inactiveTab: string
  divider: string
  pullBar: string
  topFade: string
  bottomFade: string
}

const CRAFTS_MODAL_THEME: WorldModalTheme = {
  backdrop: 'bg-[#141210]/50 backdrop-blur-xs',
  card: 'bg-[#FCF9F4] border-[#6D5738]/25 shadow-[0_25px_70px_rgba(44,34,20,0.28)] text-[#141210]',
  drawer: 'bg-[#F5F0E8] border-[#6D5738]/25 shadow-2xl text-[#141210]',
  header: 'border-[#6D5738]/20 bg-[#FCF9F4] text-[#141210]',
  subHeader: 'border-[#6D5738]/20 bg-[#FAF6EF] text-[#141210]',
  inset: 'border-[#6D5738]/20 bg-[#FAF6EF]',
  insetDashed: 'border-dashed border-[#6D5738]/30 bg-[#FCF9F4]',
  well: 'border-[#6D5738]/25 bg-[#F5F0E8]',
  title: 'text-[#141210]',
  body: 'text-[#5C4D3C]',
  muted: 'text-[#6B5A48]',
  accentText: 'text-[#7A5B32]',
  greenBadge: 'bg-emerald-50 border-emerald-600/35 text-emerald-700',
  redBadge: 'bg-rose-50 border-rose-200 text-rose-600',
  input:
    'border-[#6D5738]/25 bg-[#F5F0E8] text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40',
  closeBtn:
    'border-[#6D5738]/25 bg-[#F5F0E8] text-[#141210] hover:bg-[#EFE8DC] hover:border-[#B68D52]',
  primaryCta:
    'bg-gradient-to-r from-[#D4AF78] via-[#ECC872] to-[#D4AF78] hover:brightness-105 text-[#141210] border border-[#C69C5D]/60 shadow-[0_6px_20px_rgba(182,141,82,0.28)]',
  secondaryCta:
    'border-[#6D5738]/25 bg-[#F5F0E8] hover:bg-[#EFE8DC] hover:border-[#B68D52] text-[#141210]',
  activeTab: 'bg-[#D4AF78] text-[#141210] font-extrabold border-[#C69C5D] shadow-xs',
  inactiveTab: 'border-[#6D5738]/25 bg-[#F5F0E8] text-[#5C4D3C] hover:text-[#141210] hover:border-[#B68D52]',
  divider: 'border-[#6D5738]/20',
  pullBar: 'bg-[#D8CBB8]',
  topFade: 'from-[#F5F0E8] to-transparent',
  bottomFade: 'from-[#F5F0E8] to-transparent',
}

const AQUARIUM_MODAL_THEME: WorldModalTheme = {
  backdrop: 'bg-[#030B14]/75 backdrop-blur-sm',
  card: 'bg-[#081D30] border-sky-400/25 shadow-[0_25px_75px_rgba(2,12,24,0.75)] text-[#F0F8FF]',
  drawer: 'bg-[#051320] border-sky-400/25 shadow-[0_25px_70px_rgba(2,12,24,0.85)] text-[#F0F8FF]',
  header: 'border-sky-400/20 bg-[#081D30] text-[#F0F8FF]',
  subHeader: 'border-sky-400/20 bg-[#0A253D] text-[#F0F8FF]',
  inset: 'border-sky-400/22 bg-[#0A253D]',
  insetDashed: 'border-dashed border-emerald-400/35 bg-[#081D30]',
  well: 'border-sky-400/25 bg-[#0D2E4A]',
  title: 'text-[#F0F8FF]',
  body: 'text-[#B6D4E8]',
  muted: 'text-[#84B6D6]',
  accentText: 'text-emerald-300',
  greenBadge: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
  redBadge: 'bg-rose-500/15 border-rose-400/45 text-rose-300',
  input:
    'border-sky-400/25 bg-[#051524] text-[#F0F8FF] placeholder-[#7FAEC9]/65 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/35',
  closeBtn:
    'border-sky-400/30 bg-[#0D2E4A] text-[#F0F8FF] hover:bg-[#123B5E] hover:border-emerald-400/60',
  primaryCta:
    'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] hover:brightness-110 text-white border border-rose-400/50 shadow-[0_8px_24px_rgba(225,29,72,0.38)]',
  secondaryCta:
    'border-sky-400/28 bg-[#0D2E4A] hover:bg-[#123B5E] hover:border-emerald-400/55 text-[#F0F8FF]',
  activeTab: 'bg-[#E11D48] text-white font-extrabold border-rose-400/60 shadow-[0_4px_14px_rgba(225,29,72,0.35)]',
  inactiveTab: 'border-sky-400/25 bg-[#0D2E4A] text-[#B6D4E8] hover:text-emerald-300 hover:border-emerald-400/50',
  divider: 'border-sky-400/20',
  pullBar: 'bg-sky-400/35',
  topFade: 'from-[#051320] to-transparent',
  bottomFade: 'from-[#051320] to-transparent',
}

export function getWorldModalTheme(isAquatic: boolean): WorldModalTheme {
  return isAquatic ? AQUARIUM_MODAL_THEME : CRAFTS_MODAL_THEME
}

