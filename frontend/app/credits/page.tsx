'use client'

import React from 'react'
import Link from 'next/link'
import DeveloperCredit from '@/components/DeveloperCredit'

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <DeveloperCredit variant="full" />

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <InfoCard
            icon="🚀"
            title="Fast Delivery"
            description="We deliver high-quality projects on time, every time"
          />
          <InfoCard
            icon="💡"
            title="Innovation"
            description="Cutting-edge solutions using the latest technologies"
          />
          <InfoCard
            icon="🤝"
            title="Support"
            description="Ongoing support and maintenance for all our projects"
          />
        </div>

        {/* Project Stats */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Project Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="100+" label="Users Served" color="from-purple-500 to-purple-700" />
            <StatCard number="99.9%" label="Uptime" color="from-blue-500 to-blue-700" />
            <StatCard number="24/7" label="Support" color="from-pink-500 to-pink-700" />
            <StatCard number="🇳🇬" label="Made in Nigeria" color="from-green-500 to-green-700" />
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="text-5xl mb-6">💬</div>
          <blockquote className="text-xl md:text-2xl font-medium mb-4 italic">
            "Technology should empower people, not complicate their lives. That's why we built Alajo."
          </blockquote>
          <p className="text-white/80 text-lg">— The Harzotech Team</p>
        </div>

        {/* Legal */}
        <div className="mt-12 text-center text-gray-500 text-sm space-y-2">
          <p>This application is a product of Harzotech Software Development</p>
          <p>All rights reserved © 2025</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-purple-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function StatCard({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
        {number}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </div>
  )
}
