'use client'

import { useState } from 'react'
import AppHeader from '@/components/AppHeader'

interface FAQ {
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    question: 'What is Alajo?',
    answer: 'Alajo is a modern digital savings platform that helps you save money daily. Inspired by the traditional Alajo (daily savings collector) system in Nigeria, we make it easy to build your savings habit with small daily contributions.',
  },
  {
    question: 'How does the 31-day savings cycle work?',
    answer: 'Every savings month in Alajo has 31 days, regardless of the actual calendar month. This makes it easier to plan your savings. The first day\'s contribution goes to Alajo as a service fee, and the remaining 30 days go to your savings.',
  },
  {
    question: 'How do I make contributions?',
    answer: 'You can contribute via bank transfer. Simply go to your savings plan, tap "Contribute", enter the amount, and complete the transfer to the provided bank account. Once confirmed, your contribution will be recorded.',
  },
  {
    question: 'Can I contribute for multiple days at once?',
    answer: 'Yes! You can contribute any amount that is a multiple of your daily contribution. For example, if your daily contribution is N500, you can pay N2,500 to cover 5 days at once.',
  },
  {
    question: 'What happens if I miss a contribution?',
    answer: 'When you make your next contribution, it will first fill in any missed days from the beginning of your cycle, then continue forward. This ensures you stay on track with your savings goal.',
  },
  {
    question: 'How do I withdraw my savings?',
    answer: 'Go to your savings plan and tap "Withdraw". Select your bank account, enter the amount, and submit your request. Withdrawals are processed within 24 hours on business days.',
  },
  {
    question: 'What is Ajo group savings?',
    answer: 'Ajo is a group savings feature where members contribute together. Each member takes turns receiving the total pool. It\'s a great way to save with friends, family, or colleagues.',
  },
  {
    question: 'Is my money safe with Alajo?',
    answer: 'Yes! Alajo partners with licensed financial institutions to ensure your funds are secure. We use bank-grade security and encryption to protect your account and transactions.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team via WhatsApp at +234 907 114 2022 or email us at support@alajo.ng. We\'re available Monday to Saturday, 8am to 8pm.',
  },
  {
    question: 'Can I have multiple savings plans?',
    answer: 'Yes! You can create multiple savings plans for different goals. Each plan can have its own daily contribution amount and target.',
  },
]

export default function HelpCenterPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Help Center" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Search */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
              placeholder="Search FAQs..."
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a
            href="https://wa.me/2349071142022?text=Hello, I need help with my Alajo account"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition animate-fade-in-up flex flex-col items-center text-center"
          >
            <span className="text-3xl mb-2">💬</span>
            <span className="font-bold text-gray-800">Chat with Us</span>
            <span className="text-xs text-gray-500">WhatsApp Support</span>
          </a>
          <a
            href="mailto:support@alajo.ng"
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition animate-fade-in-up flex flex-col items-center text-center"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-3xl mb-2">📧</span>
            <span className="font-bold text-gray-800">Email Us</span>
            <span className="text-xs text-gray-500">support@alajo.ng</span>
          </a>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-2">
            Frequently Asked Questions
          </h3>

          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <span className="text-4xl mb-4 block">🤔</span>
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                    <span
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedIndex === index && (
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 animate-fade-in-up">
          <h4 className="font-bold text-gray-800 mb-3">Still need help?</h4>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is available Monday to Saturday, 8am to 8pm WAT.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span>📞</span>
              <span className="text-gray-700">+234 907 114 2022</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📧</span>
              <span className="text-gray-700">support@alajo.ng</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
