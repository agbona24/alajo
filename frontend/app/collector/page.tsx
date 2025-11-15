'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

interface Group {
  id: number
  name: string
  code: string
  members: number
  dailyAmount: number
  monthlyTarget: number
  collected: number
  pending: number
  status: 'active' | 'completed' | 'paused'
  lastCollection: string
  todayPaid: number
  todayTotal: number
}

// Mock data
const mockCollectorData = {
  collectorName: 'Chioma Adeyemi',
  totalGroups: 3,
  groups: [
    {
      id: 1,
      name: 'Office Squad Savings',
      code: 'AJO-ABC123',
      members: 8,
      dailyAmount: 1000,
      monthlyTarget: 240000, // 8 members × ₦1000 × 30 days
      collected: 180000,
      pending: 60000,
      status: 'active' as const,
      lastCollection: '2024-11-15T10:30:00',
      todayPaid: 6,
      todayTotal: 8,
    },
    {
      id: 2,
      name: 'Market Women Ajo',
      code: 'AJO-MKT456',
      members: 12,
      dailyAmount: 500,
      monthlyTarget: 180000,
      collected: 120000,
      pending: 60000,
      status: 'active' as const,
      lastCollection: '2024-11-15T08:00:00',
      todayPaid: 10,
      todayTotal: 12,
    },
    {
      id: 3,
      name: 'Family Circle',
      code: 'AJO-FAM789',
      members: 5,
      dailyAmount: 2000,
      monthlyTarget: 300000,
      collected: 250000,
      pending: 50000,
      status: 'active' as const,
      lastCollection: '2024-11-14T18:00:00',
      todayPaid: 4,
      todayTotal: 5,
    },
  ],
  todayStats: {
    totalCollected: 45000,
    totalExpected: 52000,
    totalMembers: 25,
    paidMembers: 20,
  },
  weekStats: {
    monday: 48000,
    tuesday: 50000,
    wednesday: 47000,
    thursday: 49000,
    friday: 45000,
    saturday: 0,
    sunday: 0,
  },
}

export default function CollectorDashboard() {
  const router = useRouter()
  const [data] = useState(mockCollectorData)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTotalCollected = () => {
    return data.groups.reduce((sum, group) => sum + group.collected, 0)
  }

  const getTotalPending = () => {
    return data.groups.reduce((sum, group) => sum + group.pending, 0)
  }

  const getCollectionRate = (group: Group) => {
    return (group.collected / group.monthlyTarget) * 100
  }

  const getTodayProgress = () => {
    return (data.todayStats.totalCollected / data.todayStats.totalExpected) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Collector Dashboard"
        subtitle={`Hello, ${data.collectorName}`}
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
                {formatCurrency(data.todayStats.totalCollected)}
              </div>
              <div className="text-sm text-white/90">
                of {formatCurrency(data.todayStats.totalExpected)} expected
              </div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {data.todayStats.paidMembers}/{data.todayStats.totalMembers}
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
              <div className="text-2xl font-bold">{data.totalGroups}</div>
              <div className="text-xs text-white/80">Active Groups</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{data.todayStats.totalMembers}</div>
              <div className="text-xs text-white/80">Total Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{data.todayStats.paidMembers}</div>
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
              const todayProgress = (group.todayPaid / group.todayTotal) * 100

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
                          {formatCurrency(group.dailyAmount)}
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
                          {group.todayPaid}/{group.todayTotal} paid
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
                      <span>Last collection: {formatTime(group.lastCollection)}</span>
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
