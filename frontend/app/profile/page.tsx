'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
    })
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        router.push('/login')
      }
    }
  }

  const handleSave = () => {
    // TODO: Call API to update profile
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setEditing(false)
    alert('Profile updated successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 mb-4 opacity-90 hover:opacity-100 transition"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="opacity-90">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-purple-50 transition font-semibold"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    })
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition font-semibold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.phone || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-3">
            <SettingItem
              icon="🔔"
              title="Notifications"
              description="Manage your notification preferences"
              onClick={() => alert('Notifications settings coming soon!')}
            />
            <SettingItem
              icon="🔒"
              title="Security"
              description="Change password and security settings"
              onClick={() => alert('Security settings coming soon!')}
            />
            <SettingItem
              icon="💳"
              title="Payment Methods"
              description="Manage your payment options"
              onClick={() => alert('Payment methods coming soon!')}
            />
            <SettingItem
              icon="📄"
              title="Documents"
              description="View your statements and receipts"
              onClick={() => alert('Documents coming soon!')}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Summary</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <StatItem icon="📅" label="Member Since" value="November 2024" />
            <StatItem icon="🎯" label="Active Plans" value="2 plans" />
            <StatItem icon="💰" label="Total Saved" value="₦405,000" />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
            >
              Logout
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion feature coming soon!')
                }
              }}
              className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition font-semibold"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function SettingItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <span className="text-gray-400">→</span>
    </button>
  )
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="text-center p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  )
}
