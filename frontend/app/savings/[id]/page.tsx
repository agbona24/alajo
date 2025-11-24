'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'
import { savingsAPI, authAPI } from '@/lib/api'
import { generateContributionStatement } from '@/lib/pdfGenerator'

interface Contribution {
  id: number
  amount: number
  payment_method: string
  status: string
  reference: string
  completed_at: string
  created_at: string
}

interface Withdrawal {
  id: number
  amount: number
  status: string
  reason: string
  reference: string
  completed_at: string
  created_at: string
  bank_account?: {
    bank_name: string
    account_number: string
    account_name: string
  }
}

interface SavingsPlan {
  id: number
  name: string
  emoji: string
  target_amount: number
  current_amount: number
  frequency: string
  duration: number
  plan_type: string
  description: string
  status: string
  start_date: string
  target_date: string
  progress_percentage: number
  remaining_amount: number
  daily_contribution: number
  pending_withdrawals?: number
  available_balance?: number
  contributions: Contribution[]
  withdrawals?: Withdrawal[]
}

interface UserInfo {
  name: string
  phone: string
  email?: string
}

export default function SavingsPlanDetails() {
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<SavingsPlan | null>(null)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exportingPdf, setExportingPdf] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planData, userData] = await Promise.all([
          savingsAPI.getPlan(Number(params.id)),
          authAPI.getUser()
        ])
        setPlan(planData)
        setUser(userData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load plan')
        if (err.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  const handleExportPDF = () => {
    if (!plan || !user) return
    setExportingPdf(true)
    try {
      generateContributionStatement(
        {
          ...plan,
          contributions: plan.contributions || []
        },
        plan.contributions || [],
        user
      )
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan...</p>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-gray-600 mb-4">{error || 'Plan not found'}</p>
          <button
            onClick={() => router.push('/savings')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Back to Savings
          </button>
        </div>
      </div>
    )
  }

  const progress = plan.progress_percentage || 0
  const remaining = plan.remaining_amount || 0

  const quickActions = [
    { id: 'contribute', icon: '💰', label: 'Add Money', color: 'from-green-500 to-green-600', route: `/savings/${plan.id}/contribute` },
    { id: 'withdraw', icon: '💸', label: 'Withdraw', color: 'from-orange-500 to-orange-600', route: `/savings/${plan.id}/withdraw` },
    { id: 'passbook', icon: '📖', label: 'Passbook', color: 'from-amber-500 to-amber-600', route: `/passbook` },
    { id: 'export', icon: '📄', label: exportingPdf ? 'Exporting...' : 'Export PDF', color: 'from-blue-500 to-blue-600', onClick: () => handleExportPDF() },
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${plan.name} on Alajo`,
        text: `I'm ${Math.round(progress)}% towards my goal of ${formatCurrency(plan.target_amount)}!`,
        url: window.location.href,
      })
    }
  }

  const milestones = [
    { percentage: 25, reached: progress >= 25 },
    { percentage: 50, reached: progress >= 50 },
    { percentage: 75, reached: progress >= 75 },
    { percentage: 100, reached: progress >= 100 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader
        title={plan.name}
        subtitle={`${Math.round(progress)}% complete`}
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-6xl mb-3 drop-shadow-lg">{plan.emoji || '💰'}</div>
                <h1 className="text-2xl font-bold mb-1">{plan.name}</h1>
                <p className="text-white/80 text-sm capitalize">
                  {plan.plan_type} - {plan.frequency} savings
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80 mb-1">Progress</div>
                <div className="text-4xl font-bold">{Math.round(progress)}%</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold">{formatCurrency(plan.current_amount || 0)}</span>
                <span className="text-sm text-white/80">of {formatCurrency(plan.target_amount)}</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-white/80 text-xs mb-1">Remaining</div>
                <div className="text-lg font-bold">{formatCurrency(remaining)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-white/80 text-xs mb-1">Daily Target</div>
                <div className="text-lg font-bold">{formatCurrency(plan.daily_contribution || 300)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => action.route ? router.push(action.route) : action.onClick?.()}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {action.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <StatCard icon="📊" label="Contributions" value={(plan.contributions?.length || 0).toString()} suffix="times" />
          <StatCard icon="📅" label="Started" value={plan.start_date ? new Date(plan.start_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : '-'} />
          <StatCard icon="🎯" label="Target Date" value={plan.target_date ? new Date(plan.target_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : '-'} />
        </div>

        {/* Motivation */}
        {plan.description && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 mb-6 border-2 border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💭</span>
              <div>
                <div className="font-bold text-gray-900 mb-1">Your Motivation</div>
                <p className="text-sm text-gray-700 italic">"{plan.description}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>Milestones</span>
          </h2>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div key={milestone.percentage} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.reached
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {milestone.reached ? '✓' : milestone.percentage + '%'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{milestone.percentage}% Complete</div>
                </div>
                {milestone.reached && <span className="text-2xl">🎉</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Contribution History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-fade-in-up mb-6" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>Contribution History</span>
          </h2>

          {(!plan.contributions || plan.contributions.length === 0) ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-600">No contributions yet</p>
              <button
                onClick={() => router.push(`/savings/${plan.id}/contribute`)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold"
              >
                Make First Contribution
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {plan.contributions.slice(0, 5).map((contribution, index) => (
                <div key={contribution.id} className="flex items-start gap-4 relative">
                  {index < Math.min(plan.contributions.length, 5) - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10 shadow-md ${
                    contribution.status === 'pending'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                      : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    {contribution.status === 'pending' ? '⏳' : '✓'}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{formatCurrency(contribution.amount)}</span>
                      <span className="text-xs text-gray-500">{formatDate(contribution.completed_at || contribution.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        contribution.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>{contribution.status}</span>
                      <span className="text-xs text-gray-500 capitalize">{contribution.payment_method?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>💸</span>
              <span>Withdrawal History</span>
            </h2>
            {(plan.pending_withdrawals ?? 0) > 0 && (
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                {formatCurrency(plan.pending_withdrawals!)} pending
              </span>
            )}
          </div>

          {(!plan.withdrawals || plan.withdrawals.length === 0) ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-gray-600">No withdrawals yet</p>
              <p className="text-sm text-gray-500 mt-1">Your savings are growing!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plan.withdrawals.slice(0, 5).map((withdrawal, index) => (
                <div key={withdrawal.id} className="flex items-start gap-4 relative">
                  {index < Math.min(plan.withdrawals!.length, 5) - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10 shadow-md ${
                    withdrawal.status === 'pending'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                      : withdrawal.status === 'approved'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : withdrawal.status === 'completed'
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  }`}>
                    {withdrawal.status === 'pending' ? '⏳' :
                     withdrawal.status === 'approved' ? '✓' :
                     withdrawal.status === 'completed' ? '✓' : '✕'}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">-{formatCurrency(withdrawal.amount)}</span>
                      <span className="text-xs text-gray-500">{formatDate(withdrawal.completed_at || withdrawal.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        withdrawal.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : withdrawal.status === 'approved'
                          ? 'bg-blue-100 text-blue-700'
                          : withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>{withdrawal.status}</span>
                      {withdrawal.bank_account && (
                        <span className="text-xs text-gray-500">
                          {withdrawal.bank_account.bank_name} •••{withdrawal.bank_account.account_number.slice(-4)}
                        </span>
                      )}
                    </div>
                    {withdrawal.reason && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{withdrawal.reason}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {plan.withdrawals && plan.withdrawals.length > 5 && (
            <button
              onClick={() => router.push('/transactions?type=withdrawal')}
              className="w-full mt-4 py-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition"
            >
              View All Withdrawals
            </button>
          )}
        </div>
      </div>

      <MobileNav />

      <button
        onClick={() => router.push(`/savings/${plan.id}/contribute`)}
        className="md:hidden fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl flex items-center justify-center text-white text-2xl active:scale-90 transition-transform z-40"
        style={{ boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)' }}
      >
        💰
      </button>
    </div>
  )
}

function StatCard({ icon, label, value, suffix }: { icon: string; label: string; value: string; suffix?: string }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {suffix && <div className="text-xs text-gray-400">{suffix}</div>}
    </div>
  )
}
