'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'
import { savingsAPI, passbookAPI, authAPI } from '@/lib/api'
import { generatePassbookPDF } from '@/lib/pdfGenerator'

interface DailyStatus {
  day: number
  date: string
  day_name: string
  amount: number
  status: 'paid' | 'pending' | 'missed'
  is_future: boolean
}

interface PassbookData {
  plan: any
  month: number
  year: number
  month_name: string
  days_in_month: number
  daily_status: DailyStatus[]
  summary: {
    total_paid: number
    days_paid: number
    days_remaining: number
    expected_total: number
    completion_rate: number
  }
  user: {
    name: string
    phone: string
    email: string
  }
}

interface SavingsPlan {
  id: number
  name: string
  emoji: string
  target_amount: number
  current_amount: number
  frequency: string
  daily_contribution: number
  start_date: string
  status: string
}

export default function PassbookPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'cover' | 'monthly'>('cover')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [plans, setPlans] = useState<SavingsPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [passbookData, setPassbookData] = useState<PassbookData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [exportingPdf, setExportingPdf] = useState(false)

  // Fetch user and savings plans on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [userData, plansData] = await Promise.all([
          authAPI.getUser(),
          savingsAPI.getPlans()
        ])
        setUser(userData)
        setPlans(plansData.filter((p: SavingsPlan) => p.frequency === 'daily'))

        // Auto-select first plan if available
        if (plansData.length > 0) {
          const dailyPlans = plansData.filter((p: SavingsPlan) => p.frequency === 'daily')
          if (dailyPlans.length > 0) {
            setSelectedPlanId(dailyPlans[0].id)
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  // Fetch passbook data when plan or month changes
  useEffect(() => {
    if (selectedPlanId) {
      fetchPassbookData()
    }
  }, [selectedPlanId, selectedMonth, selectedYear])

  const fetchPassbookData = async () => {
    if (!selectedPlanId) return

    try {
      setLoading(true)
      const data = await passbookAPI.getPlanPassbook(selectedPlanId, selectedMonth, selectedYear)
      setPassbookData(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load passbook')
    } finally {
      setLoading(false)
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
    // Handle virtual dates (e.g., "2025-11-31" for day 31 in November)
    const [year, month, day] = dateString.split('-').map(Number)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Return formatted date string directly to preserve month context
    return `${String(day).padStart(2, '0')} ${monthNames[month - 1]}`
  }

  const handleExportPDF = () => {
    if (!passbookData || !user || !selectedPlan) return
    setExportingPdf(true)
    try {
      generatePassbookPDF(
        {
          id: selectedPlan.id,
          name: selectedPlan.name,
          emoji: selectedPlan.emoji,
          current_amount: selectedPlan.current_amount,
          target_amount: selectedPlan.target_amount,
          daily_contribution: selectedPlan.daily_contribution,
          frequency: selectedPlan.frequency,
          status: selectedPlan.status,
          start_date: selectedPlan.start_date,
          target_date: ''
        },
        passbookData,
        user
      )
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId)

  // Calculate stats from passbook data
  const daysPaid = passbookData?.summary.days_paid || 0
  const daysMissed = passbookData?.daily_status.filter(d => !d.is_future && d.status !== 'paid').length || 0
  const monthTotal = passbookData?.summary.total_paid || 0

  if (loading && !passbookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your passbook...</p>
        </div>
      </div>
    )
  }

  if (plans.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-safe">
        <AppHeader title="Digital Passbook" showBack />
        <div className="px-4 pt-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Savings Plans</h2>
          <p className="text-gray-600 mb-6">Create a daily savings plan to view your passbook</p>
          <button
            onClick={() => router.push('/savings/create')}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold"
          >
            Create Savings Plan
          </button>
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-safe">
      <AppHeader
        title="Digital Passbook"
        subtitle={user?.name || ''}
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-4xl mx-auto">
        {/* Plan Selector */}
        {plans.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedPlanId || ''}
              onChange={(e) => setSelectedPlanId(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-900 font-medium"
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.emoji} {plan.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {viewMode === 'cover' ? (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-8 text-white shadow-2xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-40 h-40 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 border-4 border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📖</div>
                  <h1 className="text-4xl font-bold mb-2">ALAJO</h1>
                  <p className="text-xl text-amber-100">Digital Savings Passbook</p>
                  <div className="mt-4 text-sm text-amber-200">Savings Saves Life</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-amber-200 mb-1">Account Holder</div>
                      <div className="font-bold text-lg">{user?.name || 'Loading...'}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Phone Number</div>
                      <div className="font-bold text-lg">{user?.phone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Account ID</div>
                      <div className="font-bold text-lg font-mono">ALJ-{String(user?.id || 0).padStart(6, '0')}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Member Since</div>
                      <div className="font-bold text-lg">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' }) : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPlan && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-amber-200 mb-2">Current Plan</div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedPlan.emoji || '💰'}</span>
                      <div>
                        <div className="font-bold text-xl">{selectedPlan.name}</div>
                        <div className="text-sm text-amber-200">
                          Daily Contribution: {formatCurrency(selectedPlan.daily_contribution)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Services Available</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-green-600">&#10003;</span>
                  <span>Daily contribution tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-green-600">&#10003;</span>
                  <span>Automated record keeping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-green-600">&#10003;</span>
                  <span>Digital verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-green-600">&#10003;</span>
                  <span>WhatsApp and SMS reminders</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>&#128220;</span>
                <span>Account Regulations</span>
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Report any issues immediately</li>
                <li>Minimum contribution: N300 per day</li>
                <li>Verify passbook entries after each payment</li>
                <li>First day's contribution is company service fee</li>
                <li>Bulk payments are split across days automatically</li>
                <li>Withdrawal requires collector approval</li>
              </ol>
            </div>

            <button
              onClick={() => setViewMode('monthly')}
              className="w-full py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all"
            >
              View Monthly Records
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              {/* Month/Year Selector */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2024, month - 1).toLocaleDateString('en-NG', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
                <button
                  onClick={handleExportPDF}
                  disabled={exportingPdf || !passbookData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <span>📄</span>
                  <span>{exportingPdf ? 'Exporting...' : 'Export PDF'}</span>
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {passbookData?.month_name || `${new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}`}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{daysPaid}</div>
                  <div className="text-xs text-green-600">Days Paid</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{daysMissed}</div>
                  <div className="text-xs text-red-600">Days Missed</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{formatCurrency(monthTotal)}</div>
                  <div className="text-xs text-purple-600">Total</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion Rate</span>
                  <span>{passbookData?.summary.completion_rate || 0}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${passbookData?.summary.completion_rate || 0}%` }}
                  ></div>
                </div>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading records...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300 bg-gray-50">
                        <th className="py-3 px-2 text-left font-bold text-gray-700">Day</th>
                        <th className="py-3 px-2 text-left font-bold text-gray-700">Date</th>
                        <th className="py-3 px-2 text-right font-bold text-gray-700">Amount</th>
                        <th className="py-3 px-2 text-center font-bold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passbookData?.daily_status.map((day) => (
                        <tr
                          key={day.day}
                          className={`border-b border-gray-200 ${
                            day.is_future ? 'bg-gray-50 opacity-60' :
                            day.status !== 'paid' ? 'bg-red-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-2 font-semibold text-gray-900">{day.day}</td>
                          <td className="py-3 px-2 text-gray-600">
                            <span>{formatDate(day.date)}</span>
                            <span className="text-gray-400 ml-1 text-xs">({day.day_name})</span>
                          </td>
                          <td className={`py-3 px-2 text-right font-bold ${
                            day.status === 'paid' ? 'text-green-600' :
                            day.is_future ? 'text-gray-400' : 'text-red-600'
                          }`}>
                            {day.status === 'paid' ? formatCurrency(day.amount) : '-'}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {day.is_future ? (
                              <span className="text-gray-400 text-lg">-</span>
                            ) : day.status === 'paid' ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm">&#10003;</span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm">&#10007;</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 bg-amber-50">
                        <td colSpan={2} className="py-4 px-2 font-bold text-gray-900">MONTH TOTAL</td>
                        <td className="py-4 px-2 text-right font-bold text-2xl text-amber-700">
                          {formatCurrency(monthTotal)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Selected Plan Info */}
            {selectedPlan && (
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Daily Target</span>
                    <p className="font-bold text-gray-900">{formatCurrency(selectedPlan.daily_contribution)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Target</span>
                    <p className="font-bold text-gray-900">{formatCurrency(selectedPlan.target_amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Savings</span>
                    <p className="font-bold text-green-600">{formatCurrency(selectedPlan.current_amount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <p className={`font-bold ${selectedPlan.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedPlan.status.charAt(0).toUpperCase() + selectedPlan.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setViewMode('cover')}
                className="py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                Cover Page
              </button>
              <button
                onClick={() => router.push('/savings')}
                className="py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
