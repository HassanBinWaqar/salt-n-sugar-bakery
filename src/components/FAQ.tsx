'use client'

import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'Have questions? We\'re here to help!',
    answer: 'We\'re here to answer any questions you have about our custom cakes. From flavors to designs, we\'re ready to help!'
  },
  {
    id: 2,
    question: 'Can you make cakes with specific themes?',
    answer: 'Yes! We can create custom cakes for any theme you want. Whether it\'s cartoon, superhero, princess, or any unique theme.'
  },
  {
    id: 3,
    question: 'How long does it take to order a custom cake?',
    answer: 'We recommend ordering at least 3-5 days in advance for best results. For urgent orders, please contact us directly.'
  },
  {
    id: 4,
    question: 'Are there options for food allergies?',
    answer: 'Yes, we provide options for various food allergies including gluten-free, dairy-free, and vegan. Let us know your dietary needs when ordering.'
  },
]

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <section className="py-16 bg-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Have Questions? We're Here to Help!
          </h2>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-[#FF6B6B] flex-shrink-0 transition-transform ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {openId === faq.id && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/6281234567890"
                className="bg-[#FFB4C5] hover:bg-[#FF6B6B] text-white px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2"
              >
                <span>📱</span> Contact WhatsApp
              </a>
              <p className="text-gray-700">
                <span className="font-semibold">Call/SMS:</span> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
