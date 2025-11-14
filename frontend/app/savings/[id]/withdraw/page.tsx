'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

const mockPlan = {
  id: 1,
  name: 'iPhone 15 Fund',
  emoji: '📱',
  current_amount: 245000,
  target_amount: 500000,
}

const mockBankAccounts = [
  { id: 1, bank: 'GTBank', accountNumber: '0123456789', accountName: 'Chioma Adeyemi' },
  { id: 2, bank: 'Access Bank', accountNumber: '9876543210', accountName: 'Chioma Adeyemi' },
]

type StepType = 'amount' | 'bank' | 'confirm' | 'success'

export default function WithdrawPage() {
  const router = useRouter()
  const params = useParams()
  const [plan] = useState(mockPlan)
  const [bankAccounts] = useState(mockBankAccounts)
  const [step, setStep] = useState<StepType>('amount')
  const [amount, setAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [withdrawType, setWithdrawType] = useState<'partial' | 'full'>('partial')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(value)
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

  const handleFullWithdrawal = () => {
    setAmount(plan.current_amount.toString())
    setWithdrawType('full')
  }

  const canProceedFromAmount = () => {
    const amountNum = parseInt(amount)
    return amount && amountNum > 0 && amountNum <= plan.current_amount
  }

  const canProceedFromBank = () => {
    return selectedBank !== null
  }

  const handleSubmit = () => {
    setStep('success')
  }

  const selectedBankAccount = bankAccounts.find(b => b.id === selectedBank)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <AppHeader
        title={step === 'success' ? 'Request Submitted' : 'Withdraw Money'}
        subtitle={step !== 'success' ? plan.name : ''}
        showBack={step !== 'success'}
        onBack={() => {
          if (step === 'amount') router.back()
          else if (step === 'bank') setStep('amount')
          else if (step === 'confirm') setStep('bank')
        }}
      />

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
              <div className="text-3xl font-bold">{formatCurrency(plan.current_amount)}</div>
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
                <button key={qa} onClick={() => handleQuickAmount(qa)} disabled={qa > plan.current_amount} className={`py-4 rounded-2xl font-bold transition ${qa > plan.current_amount ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-700'}`}>{formatCurrency(qa)}</button>
              ))}
            </div>

            <button onClick={handleFullWithdrawal} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg">Withdraw Everything ({formatCurrency(plan.current_amount)})</button>

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
              {bankAccounts.map((account) => (
                <button key={account.id} onClick={() => setSelectedBank(account.id)} className={`w-full p-4 rounded-2xl border-2 transition text-left ${selectedBank === account.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selectedBank === account.id ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>{selectedBank === account.id ? '✓' : '🏦'}</div>
                    <div>
                      <div className="font-bold text-gray-900">{account.bank}</div>
                      <div className="text-sm text-gray-600">{account.accountNumber}</div>
                    </div>
                  </div>
                </button>
              ))}
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
                <div className="font-bold text-gray-900">{selectedBankAccount?.bank}</div>
                <div className="text-sm text-gray-600">{selectedBankAccount?.accountNumber}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('bank')} className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold">← Back</button>
              <button onClick={handleSubmit} className="flex-1 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl">Submit ✓</button>
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
