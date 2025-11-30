'use client'

import AppHeader from '@/components/AppHeader'
import Link from 'next/link'

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
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              The journey of Alajo began in the bustling streets of Lagos, where millions of Nigerians rely on traditional savings collectors—known locally as "Alajo" or "Esusu"—to help them build financial security through disciplined daily contributions.
            </p>
            <p>
              In 2022, our co-founder Yemi Dada was managing a thriving ajo collection business with multiple collectors across Lagos. Despite the success, she identified critical inefficiencies: manual record-keeping led to disputes, cash handling posed security risks, and scaling operations was nearly impossible. When customers requested passbooks or account statements, it took days of manual compilation. Trust, while strong, was entirely dependent on personal relationships and paper records.
            </p>
            <p>
              The market opportunity was clear: Nigeria's informal savings sector processes over ₦2 trillion annually, yet remained largely untouched by technology. With over 40 million Nigerians participating in ajo systems and only 40% of the population having access to formal banking, the need for a digital solution was urgent.
            </p>
            <p>
              Recognizing that domain expertise alone wasn't enough, Yemi partnered with Azeez Agbona O., a seasoned software architect with over a decade of experience building enterprise SaaS solutions across two continents. Together, they assembled the perfect combination: deep market knowledge from three years of operating in the ajo sector, proven technical expertise from building multiple successful platforms, and an unwavering commitment to solving a problem affecting millions.
            </p>
            <p>
              In early 2024, after months of development and testing with real collectors and customers, Alajo was born. We didn't just digitize the traditional system—we reimagined it. Our platform provides instant digital passbooks, eliminates cash handling risks, enables transparent tracking, and scales operations seamlessly. What once took a team of collectors to manage hundreds of customers can now support thousands with complete accountability.
            </p>
            <p className="font-medium text-gray-800">
              Today, Alajo stands at the intersection of tradition and innovation, making the time-tested ajo system accessible, secure, and scalable for the digital age.
            </p>
          </div>
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

        {/* Founders */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Our Founders</h2>

          {/* Yemi Dada */}
          <div className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">YD</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Yemi Dada</h3>
                <p className="text-sm text-purple-600 font-medium">Co-Founder & CEO</p>
                <p className="text-xs text-gray-500 mt-1">B.Sc. Insurance, Lagos State University</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                Yemi brings invaluable domain expertise from three years of successfully operating in Nigeria's ajo savings sector, managing multiple collectors and hundreds of customers across Lagos. Her intimate understanding of the market's challenges—from trust issues to operational inefficiencies—forms the foundation of Alajo's product development.
              </p>
              <p>
                With a degree in Insurance from Lagos State University, Yemi combines financial acumen with entrepreneurial drive. Her experience managing real-world ajo operations provides critical insights into customer behavior, collector management, and the regulatory landscape that technology-only founders often miss.
              </p>
              <p className="font-medium text-gray-800">
                Her track record of building customer trust and managing collections at scale demonstrates the operational excellence that will drive Alajo's growth.
              </p>
            </div>
          </div>

          {/* Azeez Agbona */}
          <div>
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">AA</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Azeez Agbona O.</h3>
                <p className="text-sm text-blue-600 font-medium">Co-Founder & CTO</p>
                <p className="text-xs text-gray-500 mt-1">Founder, Harzotech Nigeria Ltd & Harzotech Innovative Solutions UK</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                Azeez is a veteran software architect with over a decade of experience building enterprise-grade SaaS platforms and custom applications for businesses across Nigeria and the United Kingdom. As the founder of two successful technology companies—Harzotech Nigeria Ltd and Harzotech Innovative Solutions UK—he brings proven expertise in scaling software solutions from concept to deployment.
              </p>
              <p>
                His extensive portfolio includes developing complex financial systems, payment integrations, and customer management platforms that process millions of transactions. This technical depth, combined with experience serving clients across multiple industries, positions him uniquely to architect Alajo's scalable infrastructure.
              </p>
              <p className="font-medium text-gray-800">
                Azeez's track record of building reliable, secure systems that handle sensitive financial data provides the technical foundation necessary for Alajo to scale across Nigeria and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* Why We're Positioned to Win */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 animate-fade-in-up border border-green-100" style={{ animationDelay: '0.45s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Why We're Positioned to Win</h2>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✓</span>
              <p><span className="font-semibold">Deep Market Knowledge:</span> Three years of hands-on experience in the ajo sector, understanding customer needs, pain points, and trust dynamics that can't be learned from market research alone.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✓</span>
              <p><span className="font-semibold">Proven Technical Execution:</span> Over a decade of successfully delivering complex financial systems with demonstrated ability to scale technology across markets.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✓</span>
              <p><span className="font-semibold">Existing Traction:</span> Built on real operational experience with established collector networks and customer relationships ready to onboard.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✓</span>
              <p><span className="font-semibold">Market Timing:</span> Positioned to capture Nigeria's digital savings revolution as smartphone penetration reaches 50% and fintech adoption accelerates.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✓</span>
              <p><span className="font-semibold">Scalable Infrastructure:</span> Modern technology stack built to support millions of users without compromising security or performance.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <span className="text-sm text-gray-600">2, Azeez Olaoluwa Str, Orisunbare, Ayobo, Lagos.</span>
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

        {/* Developer Credit */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💻</span>
              </div>
              <h2 className="text-xl font-bold mb-2">Development Partner</h2>
              <p className="text-white/90 text-sm">Powered by cutting-edge technology</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">H</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Harzotech</h3>
                  <p className="text-white/80 text-sm">Software Development Company</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                Building innovative fintech solutions for Africa. We specialize in creating secure, scalable, and user-friendly applications that empower businesses and individuals.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Next.js
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Laravel
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  React Native
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Cloud Infrastructure
                </span>
              </div>
            </div>

            <Link
              href="/credits"
              className="block w-full py-3 bg-white text-purple-600 rounded-xl font-semibold text-center hover:shadow-lg transition-all active:scale-95"
            >
              View Full Credits & Tech Stack
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Made with ❤️ in Nigeria by <span className="font-semibold text-purple-600">Harzotech</span></p>
          <p className="mt-1">© 2025 Alajo. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
