'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { savingsAPI, profileAPI, withdrawalsAPI } from '@/lib/api'

interface SavingsPlan {
  id: number
  name: string
  emoji: string
  current_amount: number
  target_amount: number
  available_balance?: number
  pending_withdrawals?: number
  pending_contributions?: number
}

interface BankAccount {
  id: number
  bank_name: string
  account_number: string
  account_name: string
}

type StepType = 'amount' | 'bank' | 'confirm' | 'success'

export default function WithdrawPage() {
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<SavingsPlan | null>(null)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<StepType>('amount')
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [withdrawType, setWithdrawType] = useState<'partial' | 'full'>('partial')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }

        const [planData, accountsData] = await Promise.all([
          savingsAPI.getPlan(Number(params.id)),
          profileAPI.getBankAccounts()
        ])

        setPlan(planData)
        setBankAccounts(accountsData || [])
      } catch (error: any) {
        console.error('Error fetching data:', error)
        if (error.response?.status === 401) {
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

  const formatCurrency = (value: number) => {
    const numValue = Number(value) || 0
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(numValue)
  }

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setAmount(numericValue)
  }

  const quickAmounts = [10000, 20000, 50000, 100000]

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
    setWithdrawType('partial')
  }

  const getAvailableBalance = () => {
    if (!plan) return 0
    return plan.available_balance ?? plan.current_amount
  }

  const handleFullWithdrawal = () => {
    if (plan) {
      setAmount(getAvailableBalance().toString())
      setWithdrawType('full')
    }
  }

  const canProceedFromAmount = () => {
    if (!plan) return false
    const amountNum = parseInt(amount)
    return amount && amountNum > 0 && amountNum <= getAvailableBalance()
  }

  const canProceedFromBank = () => {
    return selectedBank !== null
  }

  const handleSubmit = async () => {
    if (!plan || selectedBank === null) return

    setSubmitting(true)
    try {
      await withdrawalsAPI.create({
        plan_id: plan.id,
        amount: parseInt(amount),
        bank_account_id: selectedBank,
        reason: reason || undefined,
        type: withdrawType,
      })
      setStep('success')
    } catch (error: any) {
      console.error('Withdrawal error:', error)
      alert(error.response?.data?.message || 'Failed to submit withdrawal request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step === 'amount') router.back()
    else if (step === 'bank') setStep('amount')
    else if (step === 'confirm') setStep('bank')
  }

  const selectedBankAccount = bankAccounts.find(b => b.id === selectedBank)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-gray-600 mb-4">Plan not found</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Custom Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="h-safe-top md:hidden"></div>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            {step !== 'success' && (
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 bg-gray-100 text-gray-700 active:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {step === 'success' ? 'Request Submitted' : 'Withdraw Money'}
              </h1>
              {step !== 'success' && plan.name && (
                <p className="text-xs text-gray-500">{plan.name}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {step !== 'success' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Step {step === 'amount' ? '1' : step === 'bank' ? '2' : '3'} of 3</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 rounded-full" style={{ width: step === 'amount' ? '33%' : step === 'bank' ? '66%' : '100%' }} />
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">{plan.emoji}</div>
                <div>
                  <div className="text-lg font-bold">{plan.name}</div>
                  <div className="text-white/80 text-sm">Available Balance</div>
                </div>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(getAvailableBalance())}</div>
              {(plan.pending_withdrawals ?? 0) > 0 && (
                <div className="text-white/80 text-sm mt-2">
                  Pending withdrawals: {formatCurrency(plan.pending_withdrawals!)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₦</span>
                <input type="text" inputMode="numeric" value={amount ? parseInt(amount).toLocaleString() : ''} onChange={(e) => handleAmountChange(e.target.value)} placeholder="0" className="w-full pl-14 pr-6 py-6 text-4xl font-bold text-center bg-white border-2 border-gray-200 rounded-3xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((qa) => (
                <button key={qa} onClick={() => handleQuickAmount(qa)} disabled={qa > getAvailableBalance()} className={`py-4 rounded-2xl font-bold transition ${qa > getAvailableBalance() ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-700'}`}>{formatCurrency(qa)}</button>
              ))}
            </div>

            <button onClick={handleFullWithdrawal} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg">Withdraw Everything ({formatCurrency(getAvailableBalance())})</button>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Reason (Optional)</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why you need this money" rows={3} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition resize-none" />
            </div>

            <button onClick={() => setStep('bank')} disabled={!canProceedFromAmount()} className="w-full py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50">Continue →</button>
          </div>
        )}

        {step === 'bank' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="text-sm text-white/80 mb-1">Withdrawal Amount</div>
              <div className="text-3xl font-bold">{formatCurrency(parseInt(amount))}</div>
            </div>

            <div className="space-y-3">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏦</div>
                  <p className="text-gray-600 mb-4">No bank accounts found</p>
                  <button
                    onClick={() => router.push('/profile')}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold"
                  >
                    Add Bank Account
                  </button>
                </div>
              ) : (
                bankAccounts.map((account) => (
                  <button key={account.id} onClick={() => setSelectedBank(account.id)} className={`w-full p-4 rounded-2xl border-2 transition text-left ${selectedBank === account.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selectedBank === account.id ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>{selectedBank === account.id ? '✓' : '🏦'}</div>
                      <div>
                        <div className="font-bold text-gray-900">{account.bank_name}</div>
                        <div className="text-sm text-gray-600">{account.account_number}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('amount')} className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold">← Back</button>
              <button onClick={() => setStep('confirm')} disabled={!canProceedFromBank()} className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50">Continue →</button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900">Confirm Withdrawal</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                <div className="text-4xl font-bold">{formatCurrency(parseInt(amount))}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl">{plan.emoji}</span>
                  <span>{plan.name}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Bank Account</div>
                <div className="font-bold text-gray-900">{selectedBankAccount?.bank_name}</div>
                <div className="text-sm text-gray-600">{selectedBankAccount?.account_number}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('bank')} disabled={submitting} className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold disabled:opacity-50">← Back</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50">{submitting ? 'Processing...' : 'Submit ✓'}</button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-8"><span className="text-6xl">✓</span></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Request Submitted!</h2>
            <p className="text-lg text-gray-600 mb-8">Withdrawal for {formatCurrency(parseInt(amount))} submitted</p>
            <div className="space-y-3">
              <button onClick={() => router.push(`/savings/${plan.id}`)} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg">Back to {plan.name}</button>
              <button onClick={() => router.push('/dashboard')} className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold">Go to Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
