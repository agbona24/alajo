'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { profileAPI } from '@/lib/api'
import { toast } from '@/lib/utils/toast'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required'
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required'
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters'
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Please confirm your new password'
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    try {
      await profileAPI.changePassword(formData)
      toast.success('Password changed successfully!')
      router.push('/profile')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password'
      if (message.toLowerCase().includes('current')) {
        setErrors({ current_password: 'Current password is incorrect' })
      } else {
        toast.error(message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Change Password" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="animate-fade-in-up">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.current_password}
                onChange={(e) => {
                  setFormData({ ...formData, current_password: e.target.value })
                  if (errors.current_password) setErrors({ ...errors, current_password: '' })
                }}
                className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl focus:ring-2 outline-none transition ${
                  errors.current_password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPasswords.current ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
            )}
          </div>

          {/* New Password */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.new_password}
                onChange={(e) => {
                  setFormData({ ...formData, new_password: e.target.value })
                  if (errors.new_password) setErrors({ ...errors, new_password: '' })
                }}
                className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl focus:ring-2 outline-none transition ${
                  errors.new_password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPasswords.new ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          {/* Confirm New Password */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.new_password_confirmation}
                onChange={(e) => {
                  setFormData({ ...formData, new_password_confirmation: e.target.value })
                  if (errors.new_password_confirmation) setErrors({ ...errors, new_password_confirmation: '' })
                }}
                className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl focus:ring-2 outline-none transition ${
                  errors.new_password_confirmation
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPasswords.confirm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.new_password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {saving ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        {/* Security Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h4 className="font-bold text-blue-800 mb-2">Password Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>- Use at least 8 characters</li>
            <li>- Mix uppercase and lowercase letters</li>
            <li>- Include numbers and special characters</li>
            <li>- Avoid using personal information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
