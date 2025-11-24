'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { ajoGroupsAPI, authAPI } from '@/lib/api'

interface Group {
  id: number
  name: string
  code: string
  members: number
  daily_amount: number
  monthly_target: number
  collected: number
  pending: number
  status: string
  last_collection: string
  today_paid: number
  today_total: number
}

interface CollectorData {
  collector_name: string
  total_groups: number
  groups: Group[]
  today_stats: {
    total_collected: number
    total_expected: number
    total_members: number
    paid_members: number
  }
}

export default function CollectorDashboard() {
  const router = useRouter()
  const [data, setData] = useState<CollectorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }

        const [userData, groupsData] = await Promise.all([
          authAPI.getUser(),
          ajoGroupsAPI.getAll()
        ])

        // Transform the data for collector view
        const groups = (groupsData || []).filter((g: any) => g.role === 'collector')
        const totalMembers = groups.reduce((sum: number, g: any) => sum + (g.current_members || 0), 0)
        const totalCollected = groups.reduce((sum: number, g: any) => sum + (g.total_contributed || 0), 0)

        setData({
          collector_name: userData?.name || 'Collector',
          total_groups: groups.length,
          groups: groups.map((g: any) => ({
            id: g.id,
            name: g.name,
            code: g.code,
            members: g.current_members || 0,
            daily_amount: g.contribution_amount || 0,
            monthly_target: (g.contribution_amount || 0) * (g.current_members || 0) * 30,
            collected: g.total_contributed || 0,
            pending: 0,
            status: g.status,
            last_collection: g.last_contribution_at || '',
            today_paid: 0,
            today_total: g.current_members || 0,
          })),
          today_stats: {
            total_collected: totalCollected,
            total_expected: 0,
            total_members: totalMembers,
            paid_members: 0,
          }
        })
      } catch (error: any) {
        console.error('Error fetching data:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTotalCollected = () => {
    return data?.groups.reduce((sum, group) => sum + group.collected, 0) || 0
  }

  const getTotalPending = () => {
    return data?.groups.reduce((sum, group) => sum + group.pending, 0) || 0
  }

  const getCollectionRate = (group: Group) => {
    return group.monthly_target > 0 ? (group.collected / group.monthly_target) * 100 : 0
  }

  const getTodayProgress = () => {
    if (!data || data.today_stats.total_expected === 0) return 0
    return (data.today_stats.total_collected / data.today_stats.total_expected) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collector data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-gray-600 mb-4">Failed to load data</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Collector Dashboard"
        subtitle={`Hello, ${data.collector_name}`}
        action={{
          icon: '🔔',
          onClick: () => alert('Notifications coming soon!'),
        }}
      />

      <div className="px-4 pt-4 pb-24 max-w-6xl mx-auto">
        {/* Today's Summary Card */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl mb-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-white/80 mb-1">Today's Collections</div>
              <div className="text-4xl font-bold mb-2">
                {formatCurrency(data.today_stats.total_collected)}
              </div>
              <div className="text-sm text-white/90">
                of {formatCurrency(data.today_stats.total_expected)} expected
              </div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {data.today_stats.paid_members}/{data.today_stats.total_members}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
              <span>Collection Progress</span>
              <span>{Math.round(getTodayProgress())}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${getTodayProgress()}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{data.total_groups}</div>
              <div className="text-xs text-white/80">Active Groups</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{data.today_stats.total_members}</div>
              <div className="text-xs text-white/80">Total Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{data.today_stats.paid_members}</div>
              <div className="text-xs text-white/80">Paid Today</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => alert('Record payment feature coming soon!')}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
          >
            <div className="text-3xl mb-2">💰</div>
            <div>Record Payment</div>
          </button>
          <button
            onClick={() => alert('Send reminders feature coming soon!')}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
          >
            <div className="text-3xl mb-2">📢</div>
            <div>Send Reminders</div>
          </button>
        </div>

        {/* Groups List */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Groups</h2>
          <div className="space-y-3">
            {data.groups.map((group, index) => {
              const todayProgress = group.today_total > 0 ? (group.today_paid / group.today_total) * 100 : 0

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{group.name}</h3>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            {group.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{group.code}</div>
                      </div>
                      <button
                        onClick={() => router.push(`/ajo/${group.id}/cashbook`)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold text-sm hover:bg-purple-200 active:scale-95 transition"
                      >
                        📖 Cashbook
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{group.members}</div>
                        <div className="text-xs text-gray-600">Members</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(group.daily_amount)}
                        </div>
                        <div className="text-xs text-gray-600">Daily</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(group.collected)}
                        </div>
                        <div className="text-xs text-gray-600">Collected</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {formatCurrency(group.pending)}
                        </div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                    </div>

                    {/* Today's Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Today's Collection</span>
                        <span className="font-semibold text-gray-900">
                          {group.today_paid}/{group.today_total} paid
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${todayProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Month Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Month Progress</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round(getCollectionRate(group))}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                          style={{ width: `${getCollectionRate(group)}%` }}
                        />
                      </div>
                    </div>

                    {/* Last Collection */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last collection: {formatTime(group.last_collection)}</span>
                      <button
                        onClick={() => router.push(`/ajo/${group.id}`)}
                        className="text-blue-600 font-semibold hover:text-blue-700"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Overall Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-bold text-lg text-gray-900 mb-4">Overall Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">💵</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalCollected())}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Collected</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(getTotalPending())}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Pending</div>
            </div>
          </div>
        </div>

        {/* Pending Collections Alert */}
        {getTotalPending() > 0 && (
          <div className="mt-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <div className="font-bold text-orange-900 mb-1">
                  Pending Collections
                </div>
                <div className="text-sm text-orange-700">
                  You have {formatCurrency(getTotalPending())} in pending collections across all groups.
                  Consider sending reminders to members.
                </div>
              </div>
              <button
                onClick={() => alert('Sending reminders...')}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 active:scale-95 transition whitespace-nowrap"
              >
                Send Reminders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
