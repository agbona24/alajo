'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { dailyPaymentAPI } from '@/lib/api'
import AppHeader from '@/components/AppHeader'
import LoadingScreen from '@/components/LoadingScreen'

interface DailyPayment {
  day: number
  date: string
  isPaid: boolean
  paidAt?: string
  amount: number
}

interface Member {
  id: number
  name: string
  avatar: string
  payments: DailyPayment[]
}

interface CashbookData {
  groupId: number
  groupName: string
  month: string
  dailyAmount: number
  totalDays: number
  members: Member[]
}

export default function DailyCashbookPage() {
  const router = useRouter()
  const params = useParams()
  const [cashbook, setCashbook] = useState<CashbookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  useEffect(() => {
    const fetchCashbook = async () => {
      try {
        const groupId = Number(params.id)
        const month = selectedMonth || new Date().toISOString().slice(0, 7) // YYYY-MM format

        const calendarData = await dailyPaymentAPI.getCalendar(groupId, month)

        // Transform API data to match the component's expected format
        const membersMap = new Map()

        calendarData.members.forEach((member: any) => {
          membersMap.set(member.user_id, {
            id: member.user_id,
            name: member.user?.name || 'Unknown',
            avatar: member.user?.avatar || '👤',
            payments: []
          })
        })

        // Process calendar data to build member payments
        calendarData.calendar.forEach((dayData: any) => {
          calendarData.members.forEach((member: any) => {
            const memberPayment = dayData.payments.find((p: any) => p.user_id === member.user_id)
            const memberData = membersMap.get(member.user_id)

            if (memberData) {
              memberData.payments.push({
                day: dayData.day,
                date: dayData.date,
                isPaid: memberPayment?.status === 'paid',
                paidAt: memberPayment?.paid_at,
                amount: calendarData.group.contribution_amount
              })
            }
          })
        })

        setCashbook({
          groupId: calendarData.group.id,
          groupName: calendarData.group.name,
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          dailyAmount: calendarData.group.contribution_amount,
          totalDays: calendarData.calendar.length,
          members: Array.from(membersMap.values())
        })
      } catch (error: any) {
        console.error('Failed to fetch cashbook:', error)
        setError(error.response?.data?.message || 'Failed to load cashbook. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCashbook()
    }
  }, [params.id, selectedMonth])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const togglePayment = async (memberId: number, day: number) => {
    if (!cashbook) return

    try {
      const member = cashbook.members.find(m => m.id === memberId)
      const payment = member?.payments.find(p => p.day === day)
      if (!payment) return

      const newStatus = payment.isPaid ? 'pending' : 'paid'

      await dailyPaymentAPI.markPayment(Number(params.id), {
        user_id: memberId,
        payment_date: payment.date,
        status: newStatus,
        payment_method: 'cash'
      })

      // Update local state
      setCashbook(prev => {
        if (!prev) return prev
        return {
          ...prev,
          members: prev.members.map(member => {
            if (member.id === memberId) {
              return {
                ...member,
                payments: member.payments.map(p => {
                  if (p.day === day) {
                    return {
                      ...p,
                      isPaid: !p.isPaid,
                      paidAt: !p.isPaid ? new Date().toISOString() : undefined,
                    }
                  }
                  return p
                }),
              }
            }
            return member
          }),
        }
      })
    } catch (error: any) {
      console.error('Failed to mark payment:', error)
      setError(error.response?.data?.message || 'Failed to update payment. Please try again.')
    }
  }

  const getMemberStats = (member: Member) => {
    if (!cashbook) return { paidDays: 0, totalAmount: 0, percentage: 0 }
    const paidDays = member.payments.filter(p => p.isPaid).length
    const totalAmount = paidDays * cashbook.dailyAmount
    const percentage = (paidDays / cashbook.totalDays) * 100
    return { paidDays, totalAmount, percentage }
  }

  const getTodayDay = () => {
    return new Date().getDate()
  }

  const handleMarkAllUpToToday = async (member: Member) => {
    if (!cashbook) return

    try {
      const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      const firstDayOfMonth = new Date(member.payments[0].date).toISOString().slice(0, 10)

      await dailyPaymentAPI.bulkMark(Number(params.id), {
        user_id: member.id,
        start_date: firstDayOfMonth,
        end_date: today,
        status: 'paid',
        payment_method: 'cash'
      })

      // Refresh cashbook data
      setLoading(true)
      const month = selectedMonth || new Date().toISOString().slice(0, 7)
      const calendarData = await dailyPaymentAPI.getCalendar(Number(params.id), month)

      // Re-transform data (same logic as useEffect)
      const membersMap = new Map()
      calendarData.members.forEach((m: any) => {
        membersMap.set(m.user_id, {
          id: m.user_id,
          name: m.user?.name || 'Unknown',
          avatar: m.user?.avatar || '👤',
          payments: []
        })
      })

      calendarData.calendar.forEach((dayData: any) => {
        calendarData.members.forEach((m: any) => {
          const memberPayment = dayData.payments.find((p: any) => p.user_id === m.user_id)
          const memberData = membersMap.get(m.user_id)
          if (memberData) {
            memberData.payments.push({
              day: dayData.day,
              date: dayData.date,
              isPaid: memberPayment?.status === 'paid',
              paidAt: memberPayment?.paid_at,
              amount: calendarData.group.contribution_amount
            })
          }
        })
      })

      setCashbook({
        groupId: calendarData.group.id,
        groupName: calendarData.group.name,
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        dailyAmount: calendarData.group.contribution_amount,
        totalDays: calendarData.calendar.length,
        members: Array.from(membersMap.values())
      })
      setLoading(false)
    } catch (error: any) {
      console.error('Failed to bulk mark payments:', error)
      setError(error.response?.data?.message || 'Failed to mark payments. Please try again.')
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!cashbook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-lg text-gray-600 mb-4">{error || 'No cashbook data available'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title="Daily Cashbook"
        subtitle={cashbook.month}
        showBack
        action={{
          icon: viewMode === 'grid' ? '📋' : '📅',
          onClick: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid'),
        }}
      />

      <div className="px-4 pt-4 pb-24 max-w-6xl mx-auto">
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

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl mb-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-white/80 mb-1">{cashbook.groupName}</div>
              <div className="text-3xl font-bold mb-2">Daily Contributions</div>
              <div className="text-sm text-white/90">
                {formatCurrency(cashbook.dailyAmount)} per day × {cashbook.totalDays} days
              </div>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {cashbook.members.length} Members
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {cashbook.members.map((member, index) => {
            const stats = getMemberStats(member)
            const isExpanded = selectedMember === member.id

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Member Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setSelectedMember(isExpanded ? null : member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center text-2xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          {stats.paidDays}/{cashbook.totalDays} days • {formatCurrency(stats.totalAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(stats.percentage)}%
                        </div>
                        <div className="text-xs text-gray-500">paid</div>
                      </div>
                      <div className="text-xl text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Payment Grid */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-7 gap-2">
                        {member.payments.map((payment) => {
                          const isToday = payment.day === getTodayDay()
                          const isFuture = payment.day > getTodayDay()

                          return (
                            <button
                              key={payment.day}
                              onClick={() => !isFuture && togglePayment(member.id, payment.day)}
                              disabled={isFuture}
                              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition active:scale-95 ${
                                payment.isPaid
                                  ? 'bg-green-500 text-white shadow-sm'
                                  : isFuture
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : isToday
                                  ? 'bg-blue-500 text-white ring-2 ring-blue-600 ring-offset-2'
                                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50'
                              }`}
                            >
                              <div>{payment.day}</div>
                              {payment.isPaid && <div className="text-lg mt-1">✓</div>}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {member.payments.map((payment) => {
                          const isToday = payment.day === getTodayDay()
                          const isFuture = payment.day > getTodayDay()

                          return (
                            <div
                              key={payment.day}
                              className={`flex items-center justify-between p-3 rounded-xl ${
                                payment.isPaid
                                  ? 'bg-green-50 border border-green-200'
                                  : isFuture
                                  ? 'bg-gray-100 border border-gray-200'
                                  : isToday
                                  ? 'bg-blue-50 border-2 border-blue-500'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                  payment.isPaid
                                    ? 'bg-green-500 text-white'
                                    : isToday
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {payment.day}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    Day {payment.day}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {new Date(payment.date).toLocaleDateString('en-NG', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900">
                                    {formatCurrency(payment.amount)}
                                  </div>
                                  {payment.isPaid && payment.paidAt && (
                                    <div className="text-xs text-green-600">
                                      {new Date(payment.paidAt).toLocaleTimeString('en-NG', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {!isFuture && (
                                <button
                                  onClick={() => togglePayment(member.id, payment.day)}
                                  className={`ml-3 w-20 py-2 rounded-lg font-semibold text-sm transition active:scale-95 ${
                                    payment.isPaid
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  {payment.isPaid ? 'Unpaid' : 'Mark ✓'}
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => handleMarkAllUpToToday(member)}
                        className="py-2 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 active:scale-95 transition"
                      >
                        ✓ Mark All Up to Today
                      </button>
                      <button
                        onClick={() => {
                          alert(`Payment summary for ${member.name} will be sent via SMS/WhatsApp`)
                        }}
                        className="py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 active:scale-95 transition"
                      >
                        📤 Send Summary
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Overall Summary */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Month Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              icon="👥"
              label="Total Members"
              value={cashbook.members.length.toString()}
            />
            <SummaryCard
              icon="💰"
              label="Expected/Day"
              value={formatCurrency(cashbook.dailyAmount * cashbook.members.length)}
            />
            <SummaryCard
              icon="📅"
              label="Total Days"
              value={`${cashbook.totalDays} days`}
            />
            <SummaryCard
              icon="💵"
              label="Month Target"
              value={formatCurrency(cashbook.dailyAmount * cashbook.members.length * cashbook.totalDays)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="font-bold text-gray-900">{value}</div>
    </div>
  )
}
