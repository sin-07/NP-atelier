"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Heart, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function ToastContainer() {
  const { toasts, removeToast, isAquaticTheme } = useMarketplace()

  const getIcon = (type) => {
    const goldOrGreen = isAquaticTheme ? 'text-emerald-400' : 'text-[#D4AF78]'
    switch (type) {
      case 'cart':
        return <ShoppingBag className={`h-5 w-5 ${isAquaticTheme ? 'text-rose-400' : 'text-[#D4AF78]'}`} />
      case 'wishlist':
        return <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
      case 'success':
        return <CheckCircle2 className={`h-5 w-5 ${goldOrGreen}`} />
      default:
        return <Sparkles className={`h-5 w-5 ${isAquaticTheme ? 'text-sky-400' : 'text-[#D4AF78]'}`} />
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
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 backdrop-blur-md ${
              isAquaticTheme
                ? 'border-sky-400/35 bg-[#081D30]/95 shadow-[0_12px_30px_rgba(2,12,24,0.65)]'
                : 'border-[#8C6D46]/28 bg-[#FCF9F4]/95 shadow-[0_12px_30px_rgba(72,54,30,0.16)]'
            }`}
          >
            <div
              className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                isAquaticTheme
                  ? 'bg-[#0D2E4A] border-sky-400/25'
                  : 'bg-[#EFE8DC] border-[#8C6D46]/25'
              }`}
            >
              {getIcon(toast.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'}`}>
                {toast.title}
              </p>
              <p className={`mt-0.5 text-xs leading-5 ${isAquaticTheme ? 'text-[#B6D4E8]' : 'text-[#5C4D3C]'}`}>
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className={`grid h-6 w-6 place-items-center rounded-full transition ${
                isAquaticTheme
                  ? 'text-[#B6D4E8] hover:bg-[#0D2E4A] hover:text-white'
                  : 'text-[#5C4D3C] hover:bg-[#EFE8DC] hover:text-[#141210]'
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
