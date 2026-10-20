"use client"

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react'

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
    question: 'How do coupon codes and free shipping work?',
    answer:
      'Use code ATELIER10 at checkout for 10% off your entire order, or HANDMADE20 for 20% off during seasonal drops. All orders with a subtotal over ₹1,499 automatically receive Free Delivery across India!',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section-shell py-16 sm:py-24">
      <div className="reveal is-visible space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <HelpCircle className="h-3.5 w-3.5 text-[#B8860B]" /> Questions & Answers
          </span>
          <h2 className="heading-1 mt-3.5">
            Frequently Asked <span className="italic font-normal text-gold-gradient">Questions</span>
          </h2>
          <p className="body-lead mx-auto mt-4 text-[#4A4339]">
            Everything you need to know about custom orders, handmade materials, and our buyer protection guarantee.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF8] via-[#FAF5E8] to-[#F7ECCF]/80 transition duration-200 hover:border-[#D4AF37] shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#FAF4E2]/70"
                >
                  <span className="font-serif text-lg font-bold text-[#141414] sm:text-xl">
                    {faq.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-200 ${
                      isOpen ? 'bg-[#141414] text-[#ECC872] border border-[#D4AF37]/60' : 'bg-[#FAF4E2] text-[#735206] border border-[#D4AF37]/40'
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
                      <div className="border-t border-[#E8DEC7] px-5 pb-5 pt-3 text-sm leading-relaxed text-[#4A4339] sm:text-base">
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
        <div className="mx-auto max-w-lg rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF8] to-[#FAF4E5] p-4 text-center shadow-xs">
          <p className="text-xs text-[#4A4339]">
            Still have questions about a custom piece?{' '}
            <a href="#contact" className="font-bold text-[#7A5408] underline transition hover:text-[#5C4106]">
              Contact our studio team →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
