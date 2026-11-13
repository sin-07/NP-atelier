export const AQUARIUM_THEME_META_COLOR = '#F0F7FC'
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
  backdrop: 'bg-[#0A2540]/35 backdrop-blur-sm',
  card: 'bg-white border-sky-300/70 shadow-[0_24px_64px_rgba(14,116,144,0.16)] text-[#0A2540]',
  drawer: 'bg-[#F4FAFE] border-sky-300/70 shadow-[0_24px_64px_rgba(14,116,144,0.18)] text-[#0A2540]',
  header: 'border-sky-200/80 bg-[#FFFFFF] text-[#0A2540]',
  subHeader: 'border-sky-200/80 bg-[#EBF6FD] text-[#0A2540]',
  inset: 'border-sky-200/85 bg-[#EBF6FD]',
  insetDashed: 'border-dashed border-emerald-400/55 bg-[#F2FBF7]',
  well: 'border-sky-200/90 bg-[#E4F2FC]',
  title: 'text-[#0A2540]',
  body: 'text-[#2C5270]',
  muted: 'text-[#4B7494]',
  accentText: 'text-emerald-700',
  greenBadge: 'bg-emerald-50 border-emerald-400/50 text-emerald-700',
  redBadge: 'bg-rose-50 border-rose-400/50 text-rose-700',
  input:
    'border-sky-300/70 bg-white text-[#0A2540] placeholder-[#5A81A0]/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30',
  closeBtn:
    'border-sky-300/70 bg-[#EBF6FD] text-[#0A2540] hover:bg-sky-100 hover:border-emerald-500/60',
  primaryCta:
    'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] hover:brightness-105 text-white border border-rose-500/50 shadow-[0_8px_20px_rgba(225,29,72,0.28)]',
  secondaryCta:
    'border-sky-300/70 bg-[#EBF6FD] hover:bg-sky-100 hover:border-emerald-500/60 text-[#0A2540]',
  activeTab: 'bg-[#E11D48] text-white font-extrabold border-rose-500/70 shadow-[0_4px_12px_rgba(225,29,72,0.25)]',
  inactiveTab: 'border-sky-300/65 bg-white text-[#2C5270] hover:text-emerald-700 hover:border-emerald-400/60',
  divider: 'border-sky-200/85',
  pullBar: 'bg-sky-400/50',
  topFade: 'from-[#F4FAFE] to-transparent',
  bottomFade: 'from-[#F4FAFE] to-transparent',
}

export function getWorldModalTheme(isAquatic: boolean): WorldModalTheme {
  return isAquatic ? AQUARIUM_MODAL_THEME : CRAFTS_MODAL_THEME
}

