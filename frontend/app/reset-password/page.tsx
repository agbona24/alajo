'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useAppSettings } from '@/contexts/AppSettingsContext'
import Image from 'next/image'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { settings } = useAppSettings()
  const [formData, setFormData] = useState({
    phone: '',
    reset_code: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const phoneFromUrl = searchParams.get('phone')
    if (phoneFromUrl) {
      setFormData(prev => ({ ...prev, phone: phoneFromUrl }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.reset_code.length !== 6) {
      setError('Reset code must be 6 digits')
      setLoading(false)
      return
    }

    try {
      await authAPI.resetPassword(formData)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat() as string[]
        setError(errorMessages[0])
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to reset password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🔒</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float-particle-delayed">🔑</div>
        <div className="absolute bottom-32 left-20 text-7xl opacity-10 animate-float-particle-slow">✨</div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 pt-safe">
          <button
            onClick={() => router.push('/forgot-password')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center animate-bounce-in">
                  {settings?.app_logo ? (
                    <div className="-rotate-12 w-16 h-16 relative">
                      <Image
                        src={settings.app_logo}
                        alt={settings.app_name || 'Alajo'}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-5xl -rotate-12">🔐</span>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping-slow"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-lg">
                Enter the code sent to your email 📧
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-scale-in">
                <div className="text-center">
                  <span className="text-6xl mb-4 block animate-bounce">🎉</span>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Password Reset Successful!</h3>
                  <p className="text-green-700 text-sm mb-3">
                    Your password has been updated successfully.
                  </p>
                  <p className="text-green-600 text-sm">
                    You can now login with your new password.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Redirecting to login...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-600 text-sm flex-1">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {/* Instructions */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium mb-1">Check your email</p>
                      <p className="text-sm text-blue-700">
                        We sent a 6-digit code to your email. Enter it below along with your new password.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Number Field (Read-only) */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    📱 Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-base text-gray-700"
                    placeholder="08012345678"
                  />
                </div>

                {/* Reset Code Field */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    🔢 Reset Code
                  </label>
                  <input
                    type="text"
                    name="reset_code"
                    value={formData.reset_code}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition text-base text-center text-2xl tracking-widest font-bold"
                    placeholder="000000"
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                {/* New Password Field */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    🔐 New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition pr-12 text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl active:scale-90 transition"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Minimum 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    🔐 Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition pr-12 text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl active:scale-90 transition"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <span className="text-xl">✨</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Resend Code */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 active:scale-95 transition"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* Help Section */}
            {!success && (
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">⏰</span>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Reset code expires in 15 minutes.</span>
                    <br />
                    Make sure to check your spam folder if you don't see the email.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
