'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

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

// Mock data for demonstration
const mockCashbookData = {
  groupId: 1,
  groupName: 'Office Squad Savings',
  month: 'November 2024',
  dailyAmount: 1000, // ₦1,000 per day
  totalDays: 30,
  members: [
    {
      id: 1,
      name: 'Chioma Adeyemi',
      avatar: '👩🏾',
      payments: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        date: `2024-11-${String(i + 1).padStart(2, '0')}`,
        isPaid: i < 15, // First 15 days paid
        paidAt: i < 15 ? `2024-11-${String(i + 1).padStart(2, '0')}T10:00:00` : undefined,
        amount: 1000,
      })),
    },
    {
      id: 2,
      name: 'Ade Bakare',
      avatar: '👨🏾',
      payments: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        date: `2024-11-${String(i + 1).padStart(2, '0')}`,
        isPaid: i < 12,
        paidAt: i < 12 ? `2024-11-${String(i + 1).padStart(2, '0')}T11:00:00` : undefined,
        amount: 1000,
      })),
    },
    {
      id: 3,
      name: 'Ngozi Okafor',
      avatar: '👩🏾',
      payments: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        date: `2024-11-${String(i + 1).padStart(2, '0')}`,
        isPaid: i < 10,
        paidAt: i < 10 ? `2024-11-${String(i + 1).padStart(2, '0')}T09:30:00` : undefined,
        amount: 1000,
      })),
    },
  ],
}

export default function DailyCashbookPage() {
  const router = useRouter()
  const params = useParams()
  const [cashbook, setCashbook] = useState(mockCashbookData)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const togglePayment = (memberId: number, day: number) => {
    setCashbook(prev => ({
      ...prev,
      members: prev.members.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            payments: member.payments.map(payment => {
              if (payment.day === day) {
                return {
                  ...payment,
                  isPaid: !payment.isPaid,
                  paidAt: !payment.isPaid ? new Date().toISOString() : undefined,
                }
              }
              return payment
            }),
          }
        }
        return member
      }),
    }))
  }

  const getMemberStats = (member: Member) => {
    const paidDays = member.payments.filter(p => p.isPaid).length
    const totalAmount = paidDays * cashbook.dailyAmount
    const percentage = (paidDays / cashbook.totalDays) * 100
    return { paidDays, totalAmount, percentage }
  }

  const getTodayDay = () => {
    return new Date().getDate()
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
                        onClick={() => {
                          // Mark all unpaid days up to today as paid
                          const today = getTodayDay()
                          member.payments.forEach(payment => {
                            if (!payment.isPaid && payment.day <= today) {
                              togglePayment(member.id, payment.day)
                            }
                          })
                        }}
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
