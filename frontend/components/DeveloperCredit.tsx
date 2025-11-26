'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface DeveloperCreditProps {
  variant?: 'footer' | 'badge' | 'full'
  className?: string
}

export default function DeveloperCredit({ variant = 'footer', className = '' }: DeveloperCreditProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'badge') {
    return (
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <Link
          href="/credits"
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="text-xs font-medium">
            {isHovered ? 'View Credits' : 'Made with ❤️'}
          </span>
        </Link>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 ${className}`}>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Built with Passion
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Crafted by dedicated developers who believe in empowering Nigerians through technology
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-8 border border-purple-100 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl font-bold text-white">H</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Harzotech</h2>
              <p className="text-purple-600 font-medium mb-2">Software Development Company</p>
              <p className="text-gray-600 mb-4">
                Building innovative solutions for the African market. Passionate about fintech, mobile apps, and empowering communities through technology.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                  Full-Stack Development
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-pink-600 border border-pink-200">
                  Mobile Apps
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                  Cloud Solutions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Built With Modern Technology</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TechBadge name="Next.js" color="from-black to-gray-700" />
            <TechBadge name="React" color="from-blue-400 to-blue-600" />
            <TechBadge name="Laravel" color="from-red-500 to-red-700" />
            <TechBadge name="TypeScript" color="from-blue-600 to-blue-800" />
            <TechBadge name="Tailwind CSS" color="from-cyan-400 to-cyan-600" />
            <TechBadge name="MySQL" color="from-orange-400 to-orange-600" />
            <TechBadge name="Vercel" color="from-black to-gray-700" />
            <TechBadge name="cPanel" color="from-orange-500 to-orange-700" />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="mb-6 opacity-90">
            We build scalable web and mobile applications for businesses across Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2347069716822?text=Hello%20Harzotech%2C%20I%27m%20interested%20in%20your%20software%20development%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:contact@harzotech.com"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-all"
            >
              Send Email
            </a>
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Alajo. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ in Nigeria by <span className="text-purple-600 font-medium">Harzotech</span></p>
        </div>
      </div>
    )
  }

  // Default footer variant
  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100 hover:border-purple-200 transition-all group cursor-pointer">
        <span className="text-sm text-gray-600">
          Built with <span className="text-red-500 animate-pulse">❤️</span> in Nigeria by
        </span>
        <Link
          href="/credits"
          className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all"
        >
          Harzotech
        </Link>
        <svg
          className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

function TechBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`p-4 bg-gradient-to-br ${color} rounded-xl text-white text-center font-medium text-sm shadow-lg hover:scale-105 transition-transform`}>
      {name}
    </div>
  )
}
