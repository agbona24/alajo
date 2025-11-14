'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await authAPI.login(formData)

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
        setErrors(['Login failed. Please check your credentials.'])
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
            <p className="text-gray-600 mt-2">Welcome back!</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Your Account</h2>

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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-primary font-semibold hover:underline">
                Sign up
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
