'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import MobileNav from '@/components/MobileNav'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4">💰</div>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-safe-top bg-gradient-to-r from-primary to-secondary"></div>
        <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-4 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="animate-slide-in-left">
              <p className="text-white/80 text-sm mb-1">Welcome back 👋</p>
              <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl active:scale-95 transition"
            >
              👤
            </button>
          </div>

          {/* Quick Stats Cards - Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            <MobileStatCard
              icon="💰"
              label="Total Savings"
              value="₦0"
              gradient="from-blue-500 to-blue-600"
              delay={0}
            />
            <MobileStatCard
              icon="🎯"
              label="Active Plans"
              value="0"
              gradient="from-purple-500 to-purple-600"
              delay={100}
            />
            <MobileStatCard
              icon="📈"
              label="This Month"
              value="₦0"
              gradient="from-green-500 to-green-600"
              delay={200}
            />
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Hajo
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
        {/* Desktop Welcome Section */}
        <div className="hidden md:block bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-lg opacity-90">Let's continue your savings journey</p>
        </div>

        {/* Desktop Stats Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
          <StatCard icon="💰" title="Total Savings" value="₦0.00" subtitle="Across all plans" />
          <StatCard icon="🎯" title="Active Plans" value="0" subtitle="Savings plans" />
          <StatCard icon="📈" title="This Month" value="₦0.00" subtitle="Contributions" />
        </div>

        {/* Quick Actions - Mobile Grid */}
        <div className="md:hidden mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <MobileActionCard
              icon="➕"
              label="New Plan"
              subtitle="Create savings"
              gradient="from-purple-500 to-purple-600"
              onClick={() => router.push('/savings')}
            />
            <MobileActionCard
              icon="💵"
              label="Contribute"
              subtitle="Add money"
              gradient="from-green-500 to-green-600"
              onClick={() => router.push('/savings')}
            />
            <MobileActionCard
              icon="📊"
              label="Transactions"
              subtitle="View history"
              gradient="from-blue-500 to-blue-600"
              onClick={() => router.push('/transactions')}
            />
            <MobileActionCard
              icon="💰"
              label="My Savings"
              subtitle="All plans"
              gradient="from-pink-500 to-pink-600"
              onClick={() => router.push('/savings')}
            />
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            <ActionButton icon="➕" label="New Savings Plan" onClick={() => router.push('/savings')} />
            <ActionButton icon="💰" label="My Savings" onClick={() => router.push('/savings')} />
            <ActionButton icon="📊" label="Transactions" onClick={() => router.push('/transactions')} />
            <ActionButton icon="👤" label="Profile" onClick={() => router.push('/profile')} />
          </div>
        </div>

        {/* Savings Plans Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Your Savings Plans</h2>
            <button
              onClick={() => router.push('/savings')}
              className="text-primary font-semibold hover:underline text-sm flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-4">Start your savings journey today!</p>
            <button
              onClick={() => router.push('/savings')}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition active:scale-95"
            >
              Create Your First Plan
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 animate-fade-in-up">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Floating Action Button - Mobile */}
      <button
        onClick={() => router.push('/savings')}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40 animate-bounce-in"
        style={{ boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)' }}
      >
        ➕
      </button>
    </div>
  )
}

// Mobile Stat Card Component
function MobileStatCard({
  icon,
  label,
  value,
  gradient,
  delay
}: {
  icon: string
  label: string
  value: string
  gradient: string
  delay: number
}) {
  return (
    <div
      className={`min-w-[140px] bg-white rounded-2xl p-4 shadow-sm animate-slide-in-right`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-xl mb-3 shadow-sm`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

// Mobile Action Card Component
function MobileActionCard({
  icon,
  label,
  subtitle,
  gradient,
  onClick
}: {
  icon: string
  label: string
  subtitle: string
  gradient: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform text-left"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-sm`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-sm mb-0.5">{label}</h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </button>
  )
}

// Desktop Components
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
