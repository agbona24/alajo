'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

export default function TwoFactorAuthPage() {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(false)
  const [step, setStep] = useState<'initial' | 'setup' | 'verify'>('initial')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)

  const qrCode = 'https://via.placeholder.com/200x200?text=QR+Code'
  const secretKey = 'ABCD EFGH IJKL MNOP'

  const handleEnable2FA = () => {
    setStep('setup')
  }

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      setIsEnabled(false)
      setStep('initial')
    }
  }

  const handleContinueToVerify = () => {
    setStep('verify')
  }

  const handleVerify = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEnabled(true)
      setStep('initial')
    }, 1000)
  }

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Two-Factor Authentication"
        subtitle="Extra security for your account"
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Initial State */}
        {step === 'initial' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-2xl p-6 animate-fade-in-up ${
              isEnabled
                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                : 'bg-white border-2 border-gray-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                  isEnabled ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {isEnabled ? '✅' : '🛡️'}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${isEnabled ? 'text-white' : 'text-gray-900'}`}>
                    {isEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                  </h3>
                  <p className={`text-sm ${isEnabled ? 'text-white/90' : 'text-gray-600'}`}>
                    {isEnabled
                      ? 'Your account is protected with two-factor authentication'
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div className="text-sm text-gray-700">
                  <div className="font-bold text-gray-900 mb-1">What is 2FA?</div>
                  <p>Two-factor authentication adds an extra layer of security by requiring both your password and a verification code from your phone to log in.</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {!isEnabled ? (
                <button
                  onClick={handleEnable2FA}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🔐</span>
                  <span>Enable 2FA</span>
                </button>
              ) : (
                <button
                  onClick={handleDisable2FA}
                  className="w-full py-4 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🔓</span>
                  <span>Disable 2FA</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Setup Step */}
        {step === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Step 1: Scan QR Code</h3>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mb-6">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>

              {/* Manual Entry */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-700 mb-2">Or enter this key manually:</p>
                <div className="font-mono text-sm text-center bg-white rounded-lg py-3 px-4 border-2 border-gray-200">
                  {secretKey}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueToVerify}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Continue to Verification
            </button>

            <button
              onClick={() => setStep('initial')}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition active:scale-95 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Verify Step */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Step 2: Verify Code</h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter the 6-digit code from your authenticator app
              </p>

              {/* Code Input */}
              <div className="flex justify-center gap-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    onKeyDown={(e) => handleBackspace(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center">
                The code refreshes every 30 seconds
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.some(d => !d)}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Verify & Enable 2FA</span>
                </>
              )}
            </button>

            <button
              onClick={() => setStep('setup')}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition active:scale-95 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
