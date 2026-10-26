"use client"

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, HelpCircle, Plus, Minus, Mail, MessageCircle } from 'lucide-react'
import { useGsapReveal } from '../hooks/useGsapReveal'

const FAQS = [
  {
    question: 'What types of crafts do you feature on Atelier NP?',
    answer:
      'We curate a wide range of verified independent artisan crafts including handmade silk thread jewelry, botanical resin home decor, plaster DIY paint craft kits, small-batch aromatherapy candles, and custom keepsakes.',
  },
  {
    question: 'How long do bespoke custom craft orders take to make?',
    answer:
      'Most custom craft orders (such as resin trays, monogrammed bangles, or personalized candles) take 3 to 5 business days to handcraft, cure, and polish before shipping. Once shipped, standard delivery takes 3-4 days.',
  },
  {
    question: 'What happens if my delicate craft arrives damaged in shipping?',
    answer:
      'We pack all delicate resin, glassware, and candles in reinforced eco-friendly honeycomb wrap and crush-proof boutique boxes. In the rare event of breakage, we offer 100% free replacements or instant full refunds with our Artisan Guarantee.',
  },
  {
    question: 'How do I list and sell my own handmade crafts on Atelier NP?',
    answer:
      'Click the "Sell Craft" button in the top navigation! You can instantly list your handmade items, set your prices, add photos, and join our verified artisan community with zero setup fees.',
  },
  {
    question: 'Are all products truly 100% handmade and eco-friendly?',
    answer:
      'Yes! Every listing is vetted to ensure genuine artisan crafting. Our makers prioritize sustainable materials including non-toxic soy waxes, pure raw silks, organic dried botanicals, and biodegradable packaging.',
  },
  {
    question: 'How do coupon codes work?',
    answer:
      'Use code ATELIER10 at checkout for 10% off your entire order, or HANDMADE20 for 20% off during seasonal drops.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const { containerRef } = useGsapReveal({
    selector: '.gsap-faq-item',
    stagger: 0.035,
    yOffset: 12,
    duration: 0.35,
  })

  return (
    <section ref={containerRef} className="section-shell py-16 sm:py-24">
      <div className="space-y-10">
        <div className="gsap-faq-item mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <HelpCircle className="h-3.5 w-3.5 text-[#D4AF78]" /> Questions & Answers
          </span>
          <h2 className="heading-1 mt-3.5">
            Frequently Asked <span className="italic font-normal text-gold-gradient">Questions</span>
          </h2>
          <p className="body-lead mx-auto mt-4 text-[#B8A68B]">
            Everything you need to know about custom orders, handmade materials, and our buyer protection guarantee.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="gsap-faq-item overflow-hidden rounded-2xl border border-[#6D5738]/35 bg-gradient-to-b from-[#181714] via-[#141311] to-[#0E0D0C] transition duration-200 hover:border-[#D4AF78]/70 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#1A1815] cursor-pointer"
                >
                  <span className="font-serif text-lg font-bold text-[#F5EBDD] sm:text-xl">
                    {faq.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-200 ${
                      isOpen ? 'bg-[#D4AF78] text-[#0B0B0A] border border-[#E5C18A]' : 'bg-[#0B0B0A] text-[#D4AF78] border border-[#6D5738]/40'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-[#6D5738]/25 px-5 pb-5 pt-3 text-sm leading-relaxed text-[#B8A68B] sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="gsap-faq-item mx-auto max-w-lg rounded-2xl border border-[#6D5738]/35 bg-[#151412] p-5 text-center shadow-xs">
          <p className="text-sm font-bold text-[#F5EBDD]">
            Still have questions about a custom order or living aquatic care?
          </p>
          <p className="mt-1 text-xs text-[#B8A68B]">
            Our studio artisans and master aquarists are available for immediate guidance.
          </p>
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold">
            <a
              href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20have%20a%20question%20about%20your%20products!"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] text-[#0B0B0A] hover:bg-[#E5C18A] px-4 py-2 shadow-xs transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-[#0B0B0A]" />
              <span>WhatsApp: +91 93412 97124</span>
            </a>
            <a
              href="mailto:npatelierindia@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1A17] text-[#F5EBDD] border border-[#6D5738]/40 px-4 py-2 shadow-xs hover:bg-[#25221D] transition cursor-pointer"
            >
              <Mail className="h-4 w-4 text-[#D4AF78]" />
              <span>npatelierindia@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
