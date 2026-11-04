"use client"

import { useEffect } from 'react'

export default function Preloader() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
    try {
      sessionStorage.setItem('np_atelier_preloader_seen', 'true')
    } catch {}
  }, [])

  return null
}

