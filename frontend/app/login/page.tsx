'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import {
  shouldShowBiometricLogin,
  authenticateWithBiometric,
  getBiometricUser,
} from '@/lib/biometricAuth'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [biometricUser, setBiometricUser] = useState<{ name: string; phone: string } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  const handleBiometricLogin = useCallback(async () => {
    setBiometricLoading(true)
    setErrors([])

    try {
      const result = await authenticateWithBiometric()
      if (result.success && result.user) {
        const response = await authAPI.biometricLogin({
          phone: result.user.phone,
          biometric_token: result.credentialId || '',
        })

        if (response.token) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        router.push('/dashboard')
      } else {
        setErrors([result.error || 'Biometric authentication failed'])
      }
    } catch (error: any) {
      console.error('Biometric login error:', error)
      if (error.response?.data?.message) {
        setErrors([error.response.data.message])
      } else {
        setErrors(['Biometric login failed. Please try password login.'])
      }
    } finally {
      setBiometricLoading(false)
    }
  }, [router])

  // Check if biometric login is available and auto-trigger
  useEffect(() => {
    const checkBiometric = async () => {
      const canUseBiometric = await shouldShowBiometricLogin()
      setBiometricAvailable(canUseBiometric)

      if (canUseBiometric) {
        const user = getBiometricUser()
        setBiometricUser(user)

        // Auto-trigger biometric login after a short delay
        if (user) {
          setTimeout(() => {
            handleBiometricLogin()
          }, 500)
        }
      } else {
        // No biometric available, show password form
        setShowPasswordForm(true)
      }

      setInitialCheckDone(true)
    }
    checkBiometric()
  }, [handleBiometricLogin])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      const response = await authAPI.login(formData)

      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      router.push('/dashboard')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat() as string[]
        setErrors(errorMessages)
      } else if (error.response?.data?.message) {
        setErrors([error.response.data.message])
      } else {
        setErrors(['Login failed. Please check your credentials.'])
      }
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking biometric availability
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">💰</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float-particle-delayed">🪙</div>
        <div className="absolute bottom-32 left-20 text-7xl opacity-10 animate-float-particle-slow">💸</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float">🎯</div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 pt-safe">
          <button
            onClick={() => router.push('/')}
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
                  <span className="text-5xl -rotate-12">💰</span>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping-slow"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-ping-slower"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {biometricAvailable && biometricUser ? `Welcome back, ${biometricUser.name.split(' ')[0]}!` : 'Welcome Back!'}
              </h1>
              <p className="text-gray-600 text-lg">
                {biometricAvailable && biometricUser ? 'Use biometrics to login quickly' : 'Your savings journey continues ✨'}
              </p>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <ul className="text-red-600 text-sm flex-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Biometric Login Section - Show FIRST if available */}
            {biometricAvailable && biometricUser && !showPasswordForm && (
              <div className="animate-fade-in-up">
                {/* Biometric User Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-lg">
                      {biometricUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{biometricUser.name}</p>
                      <p className="text-gray-500">{biometricUser.phone}</p>
                    </div>
                  </div>

                  {/* Biometric Login Button */}
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricLoading}
                    className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {biometricLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">👆</span>
                        <span>Login with Biometrics</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-3">
                    Touch the sensor or look at your device
                  </p>
                </div>

                {/* Use Password Instead */}
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full py-3 text-purple-600 font-semibold hover:text-purple-800 transition flex items-center justify-center gap-2"
                >
                  <span>🔐</span>
                  <span>Use password instead</span>
                </button>

                {/* Not You Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-gray-500 text-sm mb-3">Not {biometricUser.name.split(' ')[0]}?</p>
                  <button
                    onClick={() => {
                      setShowPasswordForm(true)
                      setBiometricAvailable(false)
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Login with different account
                  </button>
                </div>
              </div>
            )}

            {/* Password Login Form - Show if no biometric or user chose password */}
            {(showPasswordForm || !biometricAvailable || !biometricUser) && (
              <>
                {/* Back to Biometric Option */}
                {biometricAvailable && biometricUser && showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="w-full mb-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">👆</span>
                    <div className="text-left">
                      <div>Login as {biometricUser.name}</div>
                      <div className="text-xs opacity-80">Use Fingerprint or Face ID</div>
                    </div>
                  </button>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  {/* Phone Number Field */}
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                      📱 Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition text-base"
                        placeholder="08012345678"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                      🔐 Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
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
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 active:scale-95 transition"
                    >
                      Forgot password?
                    </button>
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
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <span className="text-xl">→</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-sm text-gray-500 font-medium">NEW USER?</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Don&apos;t have an account yet?
                  </p>
                  <button
                    onClick={() => router.push('/register')}
                    className="w-full py-4 bg-white border-2 border-purple-300 text-purple-600 rounded-2xl font-bold hover:bg-purple-50 active:scale-98 transition-all shadow-sm"
                  >
                    Create Account 🚀
                  </button>
                </div>

                {/* Dev Mode Bypass */}
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛠️</span>
                    <span>Skip Login (Dev Mode)</span>
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    For testing - bypasses authentication
                  </p>
                </div>
              </>
            )}

            {/* Trust Badge */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-2xl">🔒</span>
                <div className="text-center">
                  <div className="font-bold text-gray-900">Bank-Level Security</div>
                  <div className="text-gray-600">Your data is encrypted & protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
