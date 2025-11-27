'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useAppSettings } from '@/contexts/AppSettingsContext'
import Image from 'next/image'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { settings } = useAppSettings()
  const [phone, setPhone] = useState('')
  const [emailMasked, setEmailMasked] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get pending verification info from localStorage
    const pendingPhone = localStorage.getItem('pending_verification_phone')
    const pendingEmail = localStorage.getItem('pending_verification_email')

    if (!pendingPhone || !pendingEmail) {
      router.push('/register')
      return
    }

    setPhone(pendingPhone)
    setEmailMasked(pendingEmail)
  }, [router])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()

    if (!/^\d{6}$/.test(pastedData)) {
      setError('Please paste a valid 6-digit code')
      return
    }

    const digits = pastedData.split('')
    setCode(digits)
    inputRefs.current[5]?.focus()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')

    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await authAPI.verifyEmail({
        phone,
        verification_code: verificationCode,
      })

      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.removeItem('pending_verification_phone')
        localStorage.removeItem('pending_verification_email')

        setSuccess('Email verified successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Verification error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Verification failed. Please check your code and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError('')
    setSuccess('')

    try {
      await authAPI.resendVerification({ phone })
      setSuccess('Verification code resent! Check your email.')
      setTimeLeft(900) // Reset timer to 15 minutes
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error: any) {
      console.error('Resend error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to resend code. Please try again.')
      }
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl rotate-12 shadow-xl flex items-center justify-center animate-bounce-in">
                {settings?.app_logo ? (
                  <div className="-rotate-12 w-14 h-14 relative">
                    <Image
                      src={settings.app_logo}
                      alt={settings.app_name || 'Alajo'}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-4xl -rotate-12">📧</span>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We sent a 6-digit code to
            </p>
            <p className="text-purple-600 font-semibold mt-1">
              {emailMasked}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-600 text-sm flex-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl animate-scale-in">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-green-600 text-sm flex-1">{success}</p>
              </div>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition"
                    disabled={loading || resendLoading}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Code expires in: <span className="font-bold text-purple-600">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || timeLeft <= 0}
              className="text-purple-600 font-semibold hover:text-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Back to Register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('pending_verification_phone')
                localStorage.removeItem('pending_verification_email')
                router.push('/register')
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Registration
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By verifying your email, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
