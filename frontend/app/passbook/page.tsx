'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { passbookAPI, authAPI } from '@/lib/api'
import AppHeader from '@/components/AppHeader'
import MobileNav from '@/components/MobileNav'
import LoadingScreen from '@/components/LoadingScreen'

interface PassbookContribution {
  day: number
  date: string
  amount: number
  signature?: string
  verified: boolean
}

interface PassbookData {
  account_holder: string
  phone: string
  account_number: string
  member_since: string
  plan?: {
    name: string
    type: string
  }
  current_month: string
  contributions: PassbookContribution[]
}

export default function PassbookPage() {
  const router = useRouter()
  const [data, setData] = useState<PassbookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'cover' | 'monthly'>('cover')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')

  useEffect(() => {
    const fetchPassbook = async () => {
      try {
        // Initialize with current month/year if not selected
        const now = new Date()
        const month = selectedMonth || String(now.getMonth() + 1)
        const year = selectedYear || String(now.getFullYear())

        const passbookData = await passbookAPI.get(month, year)
        setData(passbookData)
      } catch (error) {
        console.error('Failed to fetch passbook:', error)
        setError('Failed to load passbook. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPassbook()
  }, [selectedMonth, selectedYear])

  if (loading) {
    return <LoadingScreen />
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-lg text-gray-600 mb-4">{error || 'No passbook data available'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const monthTotal = data.contributions.reduce((sum, c) => sum + c.amount, 0)
  const daysContributed = data.contributions.filter(c => c.amount > 0).length
  const daysMissed = data.contributions.filter(c => c.amount === 0).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-safe">
      <AppHeader
        title="Digital Passbook"
        subtitle={data.account_holder}
        showBack
      />

      <div className="px-4 pt-4 pb-24 max-w-4xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 text-sm flex-1">{error}</p>
            </div>
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
                  <h1 className="text-4xl font-bold mb-2">HAJO</h1>
                  <p className="text-xl text-amber-100">Digital Savings Passbook</p>
                  <div className="mt-4 text-sm text-amber-200">Savings Saves Life</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-amber-200 mb-1">Account Holder</div>
                      <div className="font-bold text-lg">{data.account_holder}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Phone Number</div>
                      <div className="font-bold text-lg">{data.phone}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Account Number</div>
                      <div className="font-bold text-lg font-mono">{data.account_number}</div>
                    </div>
                    <div>
                      <div className="text-amber-200 mb-1">Member Since</div>
                      <div className="font-bold text-lg">{new Date(data.member_since).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                </div>

                {data.plan && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-amber-200 mb-2">Current Plan</div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">💰</span>
                      <div>
                        <div className="font-bold text-xl">{data.plan.name}</div>
                        <div className="text-sm text-amber-200">{data.plan.type}</div>
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
                  <span className="text-lg">✓</span>
                  <span>Daily contribution tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Weekly contribution tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Monthly contribution tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Automated record keeping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Digital signatures and verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>WhatsApp and SMS reminders</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📜</span>
                <span>Account Regulations</span>
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Report loss of passbook immediately</li>
                <li>Minimum contribution: N300 per day</li>
                <li>Verify passbook entries after each payment</li>
                <li>Month ends on last day - no carryover</li>
                <li>Working days: Monday to Saturday</li>
                <li>Withdrawal requires collector approval</li>
                <li>Do not tamper with digital entries</li>
                <li>Return passbook for verification after withdrawal</li>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{data.current_month}</h2>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                  Export PDF
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{daysContributed}</div>
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

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                      <th className="py-3 px-2 text-left font-bold text-gray-700">Day</th>
                      <th className="py-3 px-2 text-left font-bold text-gray-700">Date</th>
                      <th className="py-3 px-2 text-right font-bold text-gray-700">Amount</th>
                      <th className="py-3 px-2 text-center font-bold text-gray-700">Sign</th>
                      <th className="py-3 px-2 text-center font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.contributions.map((contribution) => (
                      <tr
                        key={contribution.day}
                        className={`border-b border-gray-200 ${
                          contribution.amount === 0 ? 'bg-red-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-2 font-semibold text-gray-900">{contribution.day}</td>
                        <td className="py-3 px-2 text-gray-600">{formatDate(contribution.date)}</td>
                        <td className={`py-3 px-2 text-right font-bold ${
                          contribution.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {contribution.amount > 0 ? formatCurrency(contribution.amount) : '-'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {contribution.signature && (
                            <span className="inline-block w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center">
                              {contribution.signature}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {contribution.verified ? (
                            <span className="text-green-600 text-lg">✓</span>
                          ) : (
                            <span className="text-red-600 text-lg">✗</span>
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
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Signatures</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-2">Depositor Signature</div>
                  <div className="h-16 border-b-2 border-gray-300 flex items-end pb-2">
                    <span className="text-2xl font-signature text-gray-700">Chioma A.</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Account Holder</div>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-2">Collector Signature</div>
                  <div className="h-16 border-b-2 border-gray-300 flex items-end pb-2">
                    <span className="text-2xl font-signature text-gray-700">Agent X</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Verified By</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setViewMode('cover')}
                className="py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                Cover Page
              </button>
              <button
                onClick={() => alert('Print feature coming soon!')}
                className="py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
              >
                Print
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
