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

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // Laravel validation errors
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-5xl mb-2">💰</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Alajo
            </h1>
            <p className="text-gray-600 mt-2">Start your savings journey today!</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <ul className="text-red-600 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Login
              </a>
            </p>
            <a href="/" className="block text-sm text-gray-500 hover:text-primary transition">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
