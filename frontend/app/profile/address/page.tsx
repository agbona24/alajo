'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function AddressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: '123 Herbert Macaulay Way',
    city: 'Yaba',
    state: 'Lagos',
    country: 'Nigeria',
    postalCode: '100001',
  })

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ]

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
        title="Address"
        subtitle="Manage your address"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Street Address */}
          <div className="animate-fade-in-up">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="Enter your street address"
              required
            />
          </div>

          {/* City */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="Enter your city"
              required
            />
          </div>

          {/* State */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) => updateField('state', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
              required
            >
              {nigerianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
            />
          </div>

          {/* Postal Code */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Postal Code (Optional)
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="Enter postal code"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
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
                  <span>Save Address</span>
                </>
              )}
            </button>
          </div>

          {/* Cancel Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
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
