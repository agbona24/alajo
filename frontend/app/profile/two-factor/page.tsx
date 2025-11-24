'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { twoFactorAPI, authAPI } from '@/lib/api'

export default function TwoFactorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [enabled, setEnabled] = useState(false)
  const [step, setStep] = useState<'status' | 'enable' | 'verify' | 'disable'>('status')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [statusData, userData] = await Promise.all([
          twoFactorAPI.getStatus(),
          authAPI.getUser()
        ])
        setEnabled(statusData.enabled)
        setUser(userData)
      } catch (err) {
        console.error('Failed to fetch 2FA status:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const handleEnableStart = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await twoFactorAPI.enable(password)
      setMaskedEmail(response.email_masked)
      setStep('verify')
      setPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start 2FA setup')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await twoFactorAPI.verifyEnable(code)
      setEnabled(true)
      setStep('status')
      setCode('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await twoFactorAPI.disable(password)
      setEnabled(false)
      setStep('status')
      setPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disable 2FA')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    try {
      const response = await twoFactorAPI.resendCode()
      setMaskedEmail(response.email_masked)
      alert('Verification code resent to your email')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Two-Factor Authentication" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Status View */}
        {step === 'status' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Current Status Card */}
            <div className={`rounded-2xl p-6 ${enabled ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {enabled ? '🛡️' : '🔓'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {enabled ? '2FA is Enabled' : '2FA is Disabled'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {enabled
                      ? 'Your account is protected with two-factor authentication'
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">How it works</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span>1.</span>
                  <span>When you log in, we&apos;ll send a 6-digit code to your email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span>
                  <span>Enter the code to complete your login</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span>
                  <span>This helps protect your account even if someone knows your password</span>
                </li>
              </ul>
            </div>

            {/* Email Warning if no email */}
            {!user?.email && (
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-bold text-yellow-800">Email Required</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You need to add an email address to your profile before enabling 2FA.
                    </p>
                    <button
                      onClick={() => router.push('/profile/personal-info')}
                      className="mt-2 text-sm font-semibold text-yellow-800 underline"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {enabled ? (
              <button
                onClick={() => setStep('disable')}
                className="w-full py-4 bg-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-200 transition"
              >
                Disable Two-Factor Authentication
              </button>
            ) : (
              <button
                onClick={() => setStep('enable')}
                disabled={!user?.email}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enable Two-Factor Authentication
              </button>
            )}
          </div>
        )}

        {/* Enable Step - Enter Password */}
        {step === 'enable' && (
          <form onSubmit={handleEnableStart} className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                🔐
              </div>
              <h2 className="text-xl font-bold text-gray-900">Enable 2FA</h2>
              <p className="text-gray-600 mt-1">Enter your password to continue</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('status')
                  setPassword('')
                  setError('')
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !password}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
              >
                {submitting ? 'Sending Code...' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {/* Verify Step - Enter Code */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyEnable} className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                📧
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="text-gray-600 mt-1">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-gray-900">{maskedEmail}</span>
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition text-center text-2xl font-bold tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              type="button"
              onClick={handleResendCode}
              className="w-full text-center text-purple-600 font-semibold"
            >
              Didn&apos;t receive the code? Resend
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('enable')
                  setCode('')
                  setError('')
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || code.length !== 6}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
              >
                {submitting ? 'Verifying...' : 'Enable 2FA'}
              </button>
            </div>
          </form>
        )}

        {/* Disable Step - Enter Password */}
        {step === 'disable' && (
          <form onSubmit={handleDisable} className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-gray-900">Disable 2FA</h2>
              <p className="text-gray-600 mt-1">
                This will make your account less secure.
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
              <p className="text-sm text-red-700">
                Disabling two-factor authentication means anyone with your password
                can access your account. We recommend keeping it enabled.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                placeholder="Enter your password to confirm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('status')
                  setPassword('')
                  setError('')
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Keep Enabled
              </button>
              <button
                type="submit"
                disabled={submitting || !password}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition disabled:opacity-50"
              >
                {submitting ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
