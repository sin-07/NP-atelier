import React from 'react'

interface IconProps {
  children?: React.ReactNode
  title?: string
  className?: string
}

interface BaseIconProps {
  className?: string
}

function Icon({ children, title, className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function SearchIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Search" className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  )
}

export function CartIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Cart" className={className}>
      <path d="M5 6h2l1.25 8.25a2 2 0 0 0 2 1.75h6.8a2 2 0 0 0 2-1.58L20 9H8" />
      <circle cx="10" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </Icon>
  )
}

export function HeartIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Wishlist" className={className}>
      <path
        d="M12 20.2 10.7 19C6 14.9 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4 1.9C12.8 4.7 14.3 4 15.8 4 18.5 4 20.6 6.1 20.6 8.8c0 3.4-3 6.1-7.7 10.2L12 20.2z"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  )
}

export function EyeIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Quick view" className={className}>
      <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  )
}

export function MenuIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Menu" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  )
}

export function CloseIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Close" className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  )
}

export function FacebookIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Facebook" className={className}>
      <path d="M14 8h2V5.5A2.5 2.5 0 0 0 13.5 3H12a4 4 0 0 0-4 4v1H5v3h3v10h4v-10h3l1-3z" />
    </Icon>
  )
}

export function InstagramIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Instagram" className={className}>
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.4" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function PinterestIcon({ className = '' }: BaseIconProps) {
  return (
    <Icon title="Pinterest" className={className}>
      <path d="M12 3a9 9 0 0 0-3.2 17.4c-.1-.8-.2-2 .1-2.9l1.4-5.8s-.4-.8-.4-2c0-1.8 1-3.2 2.2-3.2 1 0 1.4.7 1.4 1.5 0 .9-.6 2.4-.9 3.8-.2 1.1.6 2 1.8 2 2.2 0 3.7-2.9 3.7-6.3C18.1 5.8 15.4 3 12 3z" />
    </Icon>
  )
}

export function WhatsAppIcon({ className = '' }: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="WhatsApp"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function YouTubeIcon({ className = '' }: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="YouTube"
      className={className}
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function GoogleIcon({ className = '' }: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Google"
      className={className}
      fill="currentColor"
    >
      <path d="M12.24 10.285V13.8h6.887C18.6 15.35 17.5 18 12.24 18c-3.37 0-6.1-2.73-6.1-6.1s2.73-6.1 6.1-6.1c1.92 0 3.2 0.82 3.94 1.52l2.67-2.58C17.15 3.14 14.88 2 12.24 2 6.58 2 2 6.58 2 12.24s4.58 10.24 10.24 10.24c5.92 0 9.84-4.16 9.84-10.01 0-.67-.07-1.18-.16-1.685H12.24z" />
    </svg>
  )
}
