'use client'

import AppHeader from '@/components/AppHeader'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Privacy Policy" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in-up">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We collect information you provide directly to us:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 ml-4">
              <li>- Personal details (name, phone number, email)</li>
              <li>- Bank account information for withdrawals</li>
              <li>- Transaction history and savings data</li>
              <li>- Device information and usage data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">How We Use Your Information</h2>
            <ul className="text-gray-600 text-sm space-y-1 ml-4">
              <li>- Process your savings contributions and withdrawals</li>
              <li>- Send you transaction notifications and reminders</li>
              <li>- Verify your identity for security purposes</li>
              <li>- Improve our services and user experience</li>
              <li>- Comply with legal and regulatory requirements</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Data Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. Your financial information is stored with our licensed banking partners.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Information Sharing</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 ml-4">
              <li>- Banking partners to process transactions</li>
              <li>- Service providers who assist our operations</li>
              <li>- Law enforcement when required by law</li>
              <li>- Other group members (limited to group savings context)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Your Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 ml-4">
              <li>- Access your personal data</li>
              <li>- Correct inaccurate information</li>
              <li>- Request deletion of your account</li>
              <li>- Opt out of marketing communications</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Cookies & Analytics</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use cookies and similar technologies to improve user experience and analyze usage patterns. You can control cookie preferences through your device settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Data Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services. Transaction records are kept for regulatory compliance (minimum 7 years).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Children's Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our services are not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For privacy-related inquiries, contact our Data Protection Officer at privacy@alajo.ng or call +234 907 114 2022.
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
