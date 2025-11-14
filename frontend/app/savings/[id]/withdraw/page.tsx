'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'

// Mock plan data
const mockPlan = {
  id: 1,
  name: 'iPhone 15 Fund',
  emoji: '=Ò',
  current_amount: 245000,
  target_amount: 500000,
}

// Mock bank accounts
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
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters
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
    // In real app, this would make API call
    console.log('Withdrawal request:', {
      planId: plan.id,
      amount: parseInt(amount),
      bankAccountId: selectedBank,
      reason,
      type: withdrawType,
    })
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
          if (step === 'amount') {
            router.back()
          } else if (step === 'bank') {
            setStep('amount')
          } else if (step === 'confirm') {
            setStep('bank')
          }
        }}
      />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Progress Indicator */}
        {step !== 'success' && (
          <div className="mb-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Step {step === 'amount' ? '1' : step === 'bank' ? '2' : '3'} of 3</span>
              <span className="text-sm text-gray-500">
                {step === 'amount' ? 'Amount' : step === 'bank' ? 'Bank Account' : 'Confirm'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 rounded-full"
                style={{
                  width: step === 'amount' ? '33%' : step === 'bank' ? '66%' : '100%'
                }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Amount */}
        {step === 'amount' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Plan Info Card */}
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

            {/* Warning Notice */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">†</span>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Withdrawal Approval Required</div>
                  <p className="text-sm text-gray-700">
                    Your withdrawal request will be reviewed by your collector. You'll be notified once approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                =∏ How much you wan withdraw?
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">¶</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount ? parseInt(amount).toLocaleString() : ''}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="w-full pl-14 pr-6 py-6 text-4xl font-bold text-center bg-white border-2 border-gray-200 rounded-3xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition"
                />
              </div>
              {amount && parseInt(amount) > plan.current_amount && (
                <p className="text-sm text-red-600 mt-2 ml-1 flex items-center gap-1">
                  <span>L</span>
                  <span>Amount exceeds available balance</span>
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Quick Select</label>
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleQuickAmount(quickAmount)}
                    disabled={quickAmount > plan.current_amount}
                    className={`py-4 rounded-2xl font-bold transition active:scale-95 ${
                      quickAmount > plan.current_amount
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {formatCurrency(quickAmount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Withdrawal */}
            <button
              onClick={handleFullWithdrawal}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <span>=∞</span>
                <span>Withdraw Everything ({formatCurrency(plan.current_amount)})</span>
              </span>
            </button>

            {/* Reason (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                =› Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why you need this money now?"
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition resize-none"
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep('bank')}
              disabled={!canProceedFromAmount()}
              className="w-full py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue í
            </button>
          </div>
        )}

        {/* Step 2: Select Bank Account */}
        {step === 'bank' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Amount Summary */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="text-sm text-white/80 mb-1">Withdrawal Amount</div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(parseInt(amount))}</div>
              <div className="text-sm text-white/90">
                {withdrawType === 'full' ? 'Full withdrawal' : 'Partial withdrawal'} from {plan.name}
              </div>
            </div>

            {/* Bank Account Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                <Ê Where we go send the money?
              </label>
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedBank(account.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition active:scale-98 text-left ${
                      selectedBank === account.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        selectedBank === account.id ? 'bg-orange-500 text-white' : 'bg-gray-100'
                      }`}>
                        {selectedBank === account.id ? '' : '<Ê'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{account.bank}</div>
                        <div className="text-sm text-gray-600">{account.accountNumber}</div>
                        <div className="text-xs text-gray-500">{account.accountName}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Account */}
            <button
              onClick={() => alert('Add new account feature coming soon!')}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition active:scale-95"
            >
              + Add New Bank Account
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('amount')}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                ê Back
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!canProceedFromBank()}
                className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue í
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Confirmation Header */}
            <div className="text-center">
              <div className="text-6xl mb-4">†</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Withdrawal</h2>
              <p className="text-gray-600">Make sure say everything correct before you submit</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-gray-100">
              {/* Amount */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                <div className="text-sm text-white/80 mb-1">Withdrawal Amount</div>
                <div className="text-4xl font-bold mb-2">{formatCurrency(parseInt(amount))}</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{plan.emoji}</span>
                  <span className="text-white/90">{plan.name}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <DetailRow label="Withdrawal Type" value={withdrawType === 'full' ? 'Full Withdrawal' : 'Partial Withdrawal'} />

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">Bank Account</div>
                  {selectedBankAccount && (
                    <>
                      <div className="font-bold text-gray-900">{selectedBankAccount.bank}</div>
                      <div className="text-sm text-gray-600">{selectedBankAccount.accountNumber}</div>
                      <div className="text-sm text-gray-500">{selectedBankAccount.accountName}</div>
                    </>
                  )}
                </div>

                {reason && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Reason</div>
                    <div className="text-gray-700">{reason}</div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <DetailRow label="Processing Time" value="2-3 business days" />
                  <DetailRow label="Status" value="Pending Approval" />
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">9</span>
                <div className="text-sm text-gray-700">
                  <div className="font-bold text-gray-900 mb-1">What Happens Next?</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your collector will review this request</li>
                    <li>You'll get notification when approved</li>
                    <li>Money will be sent to your account</li>
                    <li>Usually takes 2-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('bank')}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                ê Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all"
              >
                Submit Request 
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-8 animate-fade-in-up">
            {/* Success Animation */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center animate-bounce-in">
                <span className="text-6xl"></span>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-ping-slow"></div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Request Submitted! <â</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your withdrawal request for {formatCurrency(parseInt(amount))} don enter our system
            </p>

            {/* Details Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 text-left">
              <div className="text-sm font-bold text-gray-500 uppercase mb-4">Request Details</div>
              <DetailRow label="Amount" value={formatCurrency(parseInt(amount))} />
              <DetailRow label="Plan" value={plan.name} />
              <DetailRow label="Bank" value={selectedBankAccount?.bank || ''} />
              <DetailRow label="Account" value={selectedBankAccount?.accountNumber || ''} />
              <DetailRow label="Status" value="Pending Approval" badge />
              <DetailRow label="Reference" value={`WD-${Date.now()}`} mono />
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">=Ú</span>
                <div className="text-sm text-gray-700">
                  <div className="font-bold text-gray-900 mb-1">We Go Alert You</div>
                  <p>You go receive notification when your collector approve the withdrawal. Check your email and SMS.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/savings/${plan.id}`)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
              >
                Back to {plan.name}
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, badge, mono }: {
  label: string
  value: string
  badge?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {badge ? (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
          {value}
        </span>
      ) : (
        <span className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
      )}
    </div>
  )
}
