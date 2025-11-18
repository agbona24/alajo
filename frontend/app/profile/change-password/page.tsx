'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const validatePassword = (password: string) => {
    const errors: string[] = []
    if (password.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
    if (!/[0-9]/.test(password)) errors.push('One number')
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate new password
    const passwordErrors = validatePassword(formData.newPassword)
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors)
      return
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(['Passwords do not match'])
      return
    }

    setErrors([])
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push('/profile')
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordStrength = (password: string) => {
    const errors = validatePassword(password)
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (errors.length === 0) return { strength: 100, label: 'Strong', color: 'bg-green-500' }
    if (errors.length <= 1) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' }
    return { strength: 33, label: 'Weak', color: 'bg-red-500' }
  }

  const strength = passwordStrength(formData.newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Change Password"
        subtitle="Update your password"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="animate-fade-in-up">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => updateField('currentPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('current')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
              >
                {showPasswords.current ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => updateField('newPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('new')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
              >
                {showPasswords.new ? '👁️' : '🔒'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600">Password Strength</span>
                  <span className={`text-xs font-bold ${
                    strength.strength === 100 ? 'text-green-600' :
                    strength.strength === 66 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.strength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Password Requirements */}
            <div className="mt-3 space-y-1">
              {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((req, i) => {
                const errors = validatePassword(formData.newPassword)
                const isMet = formData.newPassword && !errors.includes(req)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={isMet ? 'text-green-600' : 'text-gray-400'}>
                      {isMet ? '✓' : '○'}
                    </span>
                    <span className={isMet ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {req}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('confirm')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
              >
                {showPasswords.confirm ? '👁️' : '🔒'}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <div className="font-bold text-red-900 mb-1">Password requirements not met:</div>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>

          {/* Cancel Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
