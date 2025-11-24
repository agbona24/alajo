'use client'

import AppHeader from '@/components/AppHeader'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Terms of Service" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in-up">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing and using Alajo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Description of Service</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Alajo is a digital savings platform that allows users to save money through daily contributions. We facilitate savings collection, goal tracking, and group savings (Ajo) features.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Account Registration</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Service Fee</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Alajo operates on a 31-day savings cycle. The first day's contribution of each cycle goes to Alajo as a service fee. The remaining 30 days' contributions are credited to your savings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Withdrawals</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Withdrawal requests are processed within 24 hours on business days. Alajo reserves the right to verify your identity before processing withdrawals. Minimum and maximum withdrawal limits may apply.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. User Conduct</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You agree not to use the service for any unlawful purposes, including but not limited to fraud, money laundering, or financing illegal activities. Violation may result in account suspension or termination.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Group Savings (Ajo)</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Participation in group savings is voluntary. All members must fulfill their contribution obligations. Failure to contribute may affect your standing and future participation in groups.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Alajo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount of your savings balance.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">9. Changes to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">10. Contact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For questions about these terms, please contact us at legal@alajo.ng or call +234 907 114 2022.
            </p>
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Last updated: November 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}
