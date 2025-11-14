'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      const response = await authAPI.register(formData)

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
        setErrors(['Registration failed. Please try again.'])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 text-6xl opacity-20 animate-float">🎯</div>
        <div className="absolute top-40 left-20 text-5xl opacity-15 animate-float-particle-delayed">✨</div>
        <div className="absolute bottom-32 right-20 text-7xl opacity-10 animate-float-particle-slow">📊</div>
        <div className="absolute bottom-20 left-10 text-6xl opacity-20 animate-float">🌟</div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 pt-safe">
          <button
            onClick={() => router.push('/onboarding')}
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
              {/* Animated Circle Badge */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center animate-bounce-in">
                  <span className="text-5xl -rotate-12">🚀</span>
                </div>
                {/* Floating particles around badge */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping-slow"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-400 rounded-full animate-ping-slower"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Join Hajo Today!
              </h1>
              <p className="text-gray-600 text-lg">
                Start your savings journey in seconds ✨
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

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {/* Name Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition text-base"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition text-base"
                  placeholder="you@example.com"
                />
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
                    minLength={8}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition pr-12 text-base"
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
                <p className="text-xs text-gray-500 mt-1 ml-1">Minimum 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  🔒 Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition pr-12 text-base"
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
                className="w-full py-5 bg-gradient-to-r from-green-600 via-green-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="text-xl">🚀</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Sign In Link */}
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Already have an account?
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-4 bg-white border-2 border-green-300 text-green-600 rounded-2xl font-bold hover:bg-green-50 active:scale-98 transition-all shadow-sm"
              >
                Sign In Instead 👋
              </button>
            </div>

            {/* Terms Badge */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
              <div className="flex items-start gap-3 text-xs text-gray-600">
                <span className="text-lg">📜</span>
                <p className="flex-1">
                  By creating an account, you agree to our{' '}
                  <button className="text-primary font-semibold hover:underline">Terms of Service</button>
                  {' '}and{' '}
                  <button className="text-primary font-semibold hover:underline">Privacy Policy</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
