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
