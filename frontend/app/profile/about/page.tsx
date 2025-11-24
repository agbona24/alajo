'use client'

import AppHeader from '@/components/AppHeader'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="About Alajo" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-5xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Alajo</h1>
          <p className="text-gray-600">Savings Saves Life</p>
          <p className="text-sm text-gray-500 mt-2">Version 1.0.0</p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Our Story</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Alajo is inspired by the traditional daily savings collection system that has helped millions of Nigerians build their savings for generations. The "Alajo" or "Esusu" collector would visit homes and businesses daily to collect small amounts, making saving accessible and disciplined.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            We've modernized this trusted system for the digital age, making it even more convenient, secure, and transparent. With Alajo, you can save from anywhere, track your progress in real-time, and withdraw your funds with ease.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To empower every Nigerian with the tools and discipline to build a secure financial future through accessible daily savings.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-4">What We Offer</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <h3 className="font-semibold text-gray-800">Daily Savings</h3>
                <p className="text-sm text-gray-600">Build your savings with small, consistent daily contributions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="font-semibold text-gray-800">Group Savings (Ajo)</h3>
                <p className="text-sm text-gray-600">Save together with friends and family in rotating savings groups</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-gray-800">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your savings goals with detailed passbook records</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-gray-800">Secure & Licensed</h3>
                <p className="text-sm text-gray-600">Bank-grade security with licensed financial partners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Our Team</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Alajo is built by a passionate team of fintech professionals, software engineers, and financial experts dedicated to making savings accessible to everyone.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <span className="text-sm text-gray-600">Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <span className="text-sm text-gray-600">+234 907 114 2022</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <span className="text-sm text-gray-600">hello@alajo.ng</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <span className="text-sm text-gray-600">www.alajo.ng</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Made with ❤️ in Nigeria</p>
          <p className="mt-1">© 2024 Alajo. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
