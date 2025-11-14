'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (!token || !storedUser) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alajo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-lg opacity-90">Let's continue your savings journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="💰"
            title="Total Savings"
            value="₦0.00"
            subtitle="Across all plans"
          />
          <StatCard
            icon="🎯"
            title="Active Plans"
            value="0"
            subtitle="Savings plans"
          />
          <StatCard
            icon="📈"
            title="This Month"
            value="₦0.00"
            subtitle="Contributions"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <ActionButton icon="➕" label="New Savings Plan" onClick={() => alert('Coming soon!')} />
            <ActionButton icon="💵" label="Make Contribution" onClick={() => alert('Coming soon!')} />
            <ActionButton icon="📊" label="View Analytics" onClick={() => alert('Coming soon!')} />
            <ActionButton icon="💳" label="Withdraw Funds" onClick={() => alert('Coming soon!')} />
          </div>
        </div>

        {/* Savings Plans Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Savings Plans</h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-4">You don't have any savings plans yet</p>
            <button
              onClick={() => alert('Coming soon!')}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Create Your First Plan
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, subtitle }: { icon: string; title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

function ActionButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-purple-50 transition"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </button>
  )
}
