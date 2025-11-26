'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useAppSettings } from '@/contexts/AppSettingsContext'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { settings } = useAppSettings()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailMasked, setEmailMasked] = useState('')
  const [hasEmail, setHasEmail] = useState(true)
  const [collectorInfo, setCollectorInfo] = useState<{ name: string; phone: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await authAPI.requestPasswordReset({ phone })

      if (response.has_email) {
        setHasEmail(true)
        setEmailMasked(response.email_masked)
        setSuccess(true)
        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          router.push(`/reset-password?phone=${encodeURIComponent(phone)}`)
        }, 2000)
      } else {
        setHasEmail(false)
        setCollectorInfo(response.collector)
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('No account found with this phone number')
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to send reset code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🔐</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float-particle-delayed">🔑</div>
        <div className="absolute bottom-32 left-20 text-7xl opacity-10 animate-float-particle-slow">📧</div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 pt-safe">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Back to Login</span>
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
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping-slow"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-lg">
                No worries! We'll help you reset it 🔑
              </p>
            </div>

            {/* Success Message */}
            {success && hasEmail && (
              <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-scale-in">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">✅</span>
                  <h3 className="text-lg font-bold text-green-900 mb-2">Reset Code Sent!</h3>
                  <p className="text-green-700 text-sm mb-3">
                    We've sent a 6-digit code to your email:
                  </p>
                  <p className="text-green-900 font-bold mb-3">{emailMasked}</p>
                  <p className="text-green-600 text-xs">
                    Check your inbox and spam folder. Code expires in 15 minutes.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Redirecting to reset page...</span>
                  </div>
                </div>
              </div>
            )}

            {/* No Email Message */}
            {!hasEmail && collectorInfo && (
              <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-scale-in">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">📞</span>
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">Contact Your Collector</h3>
                  <p className="text-yellow-700 text-sm mb-4">
                    You don't have an email registered. Please contact your collector for password reset assistance:
                  </p>
                  <div className="bg-white rounded-xl p-4 border border-yellow-200">
                    <p className="font-bold text-gray-900">{collectorInfo.name}</p>
                    <p className="text-gray-600">{collectorInfo.phone}</p>
                  </div>
                  <button
                    onClick={() => router.push('/login')}
                    className="mt-4 w-full py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition"
                  >
                    Back to Login
                  </button>
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
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {/* Instructions */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium mb-1">How it works:</p>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Enter your registered phone number</li>
                        <li>We'll send a 6-digit code to your email</li>
                        <li>Use the code to create a new password</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    📱 Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition text-base"
                      placeholder="08012345678"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Enter the phone number you used to register
                  </p>
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
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Code</span>
                        <span className="text-xl">📧</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

            {/* Help Section */}
            {!success && (
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">❓</span>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Need help? </span>
                    Contact your collector or admin for assistance.
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
