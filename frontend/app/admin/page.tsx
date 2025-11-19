'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminAPI } from '@/lib/api'
import AppHeader from '@/components/AppHeader'
import LoadingScreen from '@/components/LoadingScreen'

interface AdminStats {
  total_users: number
  total_groups: number
  active_groups: number
  total_savings_plans: number
  total_savings_amount: number
  total_transactions: number
  total_transaction_amount: number
}

interface RecentUser {
  id: number
  name: string
  email: string
  created_at: string
}

interface RecentGroup {
  id: number
  name: string
  group_code: string
  status: string
  created_at: string
  creator?: {
    name: string
    email: string
  }
}

interface Collector {
  id: number
  name: string
  email: string
  groups_count: number
  total_collected: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentGroups, setRecentGroups] = useState<RecentGroup[]>([])
  const [topCollectors, setTopCollectors] = useState<Collector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'collectors'>('overview')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, usersData, groupsData, collectorsData] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getRecentUsers(),
          adminAPI.getRecentGroups(),
          adminAPI.getTopCollectors()
        ])

        setStats(statsData)
        setRecentUsers(usersData)
        setRecentGroups(groupsData)
        setTopCollectors(collectorsData)
      } catch (error: any) {
        console.error('Failed to fetch admin data:', error)
        setError(error.response?.data?.message || 'Failed to load admin dashboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👑</div>
          <p className="text-lg text-gray-600 mb-4">{error || 'No admin data available'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-safe">
      <AppHeader
        title="Admin Dashboard"
        subtitle="System Overview & Management"
        action={{
          icon: '⚙️',
          onClick: () => alert('Settings coming soon!'),
        }}
      />

      <div className="px-4 pt-4 pb-24 max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-semibold text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg animate-fade-in-up">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold mb-1">{stats.total_users.toLocaleString()}</div>
            <div className="text-sm text-blue-100">Total Users</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl mb-2">🏦</div>
            <div className="text-3xl font-bold mb-1">{stats.total_groups.toLocaleString()}</div>
            <div className="text-sm text-green-100">Total Groups</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(stats.total_savings_amount)}</div>
            <div className="text-sm text-purple-100">Total Savings</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">{stats.total_transactions.toLocaleString()}</div>
            <div className="text-sm text-orange-100">Transactions</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ✅
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-green-600">{stats.active_groups}</div>
                <div className="text-sm text-gray-600">Active Groups</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                💳
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.total_transaction_amount)}</div>
                <div className="text-sm text-gray-600">Transaction Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            👥 Recent Users
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeTab === 'groups'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏦 Recent Groups
          </button>
          <button
            onClick={() => setActiveTab('collectors')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeTab === 'collectors'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ⭐ Top Collectors
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Platform Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Savings Plans</span>
                  <span className="font-bold text-gray-900">{stats.total_savings_plans}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Active Ajo Groups</span>
                  <span className="font-bold text-green-600">{stats.active_groups}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Total Groups</span>
                  <span className="font-bold text-gray-900">{stats.total_groups}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Platform Users</span>
                  <span className="font-bold text-blue-600">{stats.total_users}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-4">Financial Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100">Total Savings Amount</span>
                  <span className="font-bold text-2xl">{formatCurrency(stats.total_savings_amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100">Transaction Volume</span>
                  <span className="font-bold text-2xl">{formatCurrency(stats.total_transaction_amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100">Total Transactions</span>
                  <span className="font-bold text-xl">{stats.total_transactions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Recent Users</h3>
              <p className="text-sm text-gray-600">Latest user registrations</p>
            </div>
            <div className="divide-y divide-gray-100">
              {recentUsers.map((user, index) => (
                <div key={user.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{formatDate(user.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Recent Groups</h3>
              <p className="text-sm text-gray-600">Latest Ajo group creations</p>
            </div>
            <div className="divide-y divide-gray-100">
              {recentGroups.map((group) => (
                <div key={group.id} className="p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => router.push(`/ajo/${group.id}`)}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-lg">
                      🏦
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600">{group.group_code}</div>
                      {group.creator && (
                        <div className="text-xs text-gray-500 mt-1">Created by {group.creator.name}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {group.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(group.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collectors' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Top Collectors</h3>
              <p className="text-sm text-gray-600">Most active group administrators</p>
            </div>
            <div className="divide-y divide-gray-100">
              {topCollectors.map((collector, index) => (
                <div key={collector.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{index < 3 ? ['🥇', '🥈', '🥉'][index] : '⭐'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{collector.name}</div>
                      <div className="text-sm text-gray-600">{collector.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{collector.groups_count} groups</div>
                      <div className="text-xs text-gray-500">{formatCurrency(collector.total_collected)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
