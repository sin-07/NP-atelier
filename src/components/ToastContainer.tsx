"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Heart, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useMarketplace()

  const getIcon = (type) => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="h-5 w-5 text-[#D4AF78]" />
      case 'wishlist':
        return <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-[#D4AF78]" />
      default:
        return <Sparkles className="h-5 w-5 text-[#D4AF78]" />
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[9999] flex max-w-sm flex-col gap-2.5 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#191713] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)]">
              {getIcon(toast.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#F5EBDD]">{toast.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#B8AA96]">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="grid h-6 w-6 place-items-center rounded-full text-[#B8AA96] transition hover:bg-[#12110F] hover:text-[#F5EBDD]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
