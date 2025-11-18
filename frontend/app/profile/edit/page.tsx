'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

const mockUser = {
  name: 'Chioma Adeyemi',
  email: 'chioma.adeyemi@example.com',
  phone: '+234 803 456 7890',
  avatar: '👩🏾',
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState(mockUser)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push('/profile')
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Edit Profile"
        subtitle="Update your information"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection */}
          <div className="animate-fade-in-up">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Choose Avatar
            </label>
            <div className="flex gap-3 flex-wrap">
              {['👨🏾', '👩🏾', '👨🏽', '👩🏽', '👨', '👩', '🧑', '👤'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => updateField('avatar', emoji)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition active:scale-95 ${
                    formData.avatar === emoji
                      ? 'bg-gradient-to-br from-primary to-secondary shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="your.email@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send important updates to this email
            </p>
          </div>

          {/* Phone Number */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="+234 XXX XXX XXXX"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              For account verification and important notifications
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Cancel Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
