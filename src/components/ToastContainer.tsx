"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Heart, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useMarketplace()

  const getIcon = (type) => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="h-5 w-5 text-[#855a10]" />
      case 'wishlist':
        return <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-[#855a10]" />
      default:
        return <Sparkles className="h-5 w-5 text-[#855a10]" />
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
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#d4a338]/40 bg-gradient-to-br from-[#fffdf9] via-[#faeed1] to-[#f6e1b3] p-3.5 shadow-[0_12px_30px_rgba(133,90,16,0.20)]"
          >
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#faeed1] border border-[#d4a338]/30">
              {getIcon(toast.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#241705]">{toast.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#5e4318]">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="grid h-6 w-6 place-items-center rounded-full text-[#73562a] transition hover:bg-[#faeed1] hover:text-[#241705]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
