'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { savingsAPI } from '@/lib/api'

interface SavingsPlan {
  id: number
  name: string
  emoji: string
  target_amount: number
  current_amount: number
  daily_contribution: number
  progress_percentage: number
  remaining_amount: number
}

const paymentMethods = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', color: 'from-green-500 to-green-600', description: 'Transfer to our account', enabled: true },
  { id: 'card', name: 'Debit Card', icon: '💳', color: 'from-blue-500 to-blue-600', description: 'Coming Soon', enabled: false },
  { id: 'wallet', name: 'Wallet', icon: '👛', color: 'from-purple-500 to-purple-600', description: 'Coming Soon', enabled: false },
]

// Platform bank account details
const platformBankDetails = {
  bankName: 'PalmPay',
  accountName: 'OLUYEMI OLA DADA',
  accountNumber: '9071142022',
}

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

// 10 minutes in seconds
const TRANSFER_TIMEOUT = 10 * 60

export default function ContributePage() {
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<SavingsPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'input' | 'transfer' | 'confirm' | 'success'>('input')
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer')
  const [note, setNote] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [transactionRef, setTransactionRef] = useState('')

  // Transfer step states
  const [timeLeft, setTimeLeft] = useState(TRANSFER_TIMEOUT)
  const [timerActive, setTimerActive] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }
        const data = await savingsAPI.getPlan(Number(params.id))
        setPlan(data)
      } catch (error: any) {
        console.error('Error fetching plan:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPlan()
    }
  }, [params.id, router])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle receipt file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Start transfer process
  const handleStartTransfer = () => {
    setStep('transfer')
    setTimeLeft(TRANSFER_TIMEOUT)
    setTimerActive(true)
  }

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount) || 0
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  // Store contribution response data for success screen
  const [contributionResult, setContributionResult] = useState<{
    days_covered: number
    company_fee: number
    member_savings: number
    message: string
  } | null>(null)

  const handleConfirm = async () => {
    if (!plan) return

    setSubmitting(true)
    try {
      const response = await savingsAPI.contribute(plan.id, {
        amount: parseFloat(amount),
        payment_method: selectedMethod,
        reference: note || undefined,
        receipt: receiptFile,
      })

      // Update plan with the actual values from API response
      if (response.plan) {
        setPlan(response.plan)
      }

      // Store contribution result for success screen
      setContributionResult({
        days_covered: response.days_covered || 1,
        company_fee: response.company_fee || 0,
        member_savings: response.member_savings || parseFloat(amount),
        message: response.message || 'Contribution successful',
      })

      setTransactionRef(response.contribution?.reference || `TXN${Date.now()}`)
      setStep('success')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error: any) {
      console.error('Contribution error:', error)
      alert(error.response?.data?.message || 'Failed to make contribution')
    } finally {
      setSubmitting(false)
    }
  }

  const newTotal = (plan?.current_amount || 0) + (parseFloat(amount) || 0)
  const newProgress = plan ? Math.min(Math.round((newTotal / plan.target_amount) * 100), 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-safe">
      <AppHeader
        title={step === 'success' ? 'Success!' : 'Add Money'}
        subtitle={step === 'success' ? 'Contribution successful' : plan.name}
        showBack={step !== 'success'}
      />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{plan.emoji}</span>
                <div>
                  <h2 className="font-bold text-lg">{plan.name}</h2>
                  <p className="text-sm text-white/80">Current: {formatCurrency(plan.current_amount)}</p>
                </div>
              </div>
              <div className="text-xs text-white/70">
                Target: {formatCurrency(plan.target_amount)}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
                How much you wan add? 💰
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-3xl font-bold">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-16 pr-6 py-6 text-center text-4xl font-bold border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition bg-white"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Minimum contribution: ₦300</p>
            </div>

            {/* Quick Amounts */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`py-3 px-4 rounded-xl font-semibold transition active:scale-95 ${
                      amount === quickAmount.toString()
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₦{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* New Progress Preview */}
            {amount && parseFloat(amount) >= 300 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 animate-fade-in-up">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">New Progress</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(newTotal)}</span>
                      <span className="text-sm text-gray-500">({newProgress}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${newProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Choose Payment Method
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => method.enabled && setSelectedMethod(method.id)}
                    disabled={!method.enabled}
                    className={`w-full p-4 rounded-xl border-2 transition text-left ${
                      !method.enabled
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : selectedMethod === method.id
                          ? `border-green-500 bg-gradient-to-br ${method.color} text-white shadow-lg active:scale-95`
                          : 'border-gray-200 bg-white hover:border-gray-300 active:scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        !method.enabled
                          ? 'bg-gray-200'
                          : selectedMethod === method.id ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold flex items-center gap-2">
                          {method.name}
                          {!method.enabled && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Coming Soon</span>
                          )}
                        </div>
                        <div className={`text-sm ${
                          !method.enabled
                            ? 'text-gray-400'
                            : selectedMethod === method.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {method.description}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        !method.enabled
                          ? 'border-gray-300'
                          : selectedMethod === method.id
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                      }`}>
                        {method.enabled && selectedMethod === method.id && (
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${method.color}`} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Transfer Details */}
            {selectedMethod === 'bank_transfer' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200 animate-fade-in-up">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Transfer to this Account</h3>
                    <p className="text-sm text-gray-600">Make a transfer and we go confirm your payment</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bank Name</span>
                    <span className="font-bold text-gray-900">{platformBankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Name</span>
                    <span className="font-bold text-gray-900">{platformBankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl text-green-600 font-mono">{platformBankDetails.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(platformBankDetails.accountNumber)
                          alert('Account number copied!')
                        }}
                        className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition active:scale-95"
                      >
                        <span className="text-lg">📋</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-start gap-2 text-sm text-yellow-800">
                    <span>⚠️</span>
                    <p>After transfer, your contribution go reflect for your account within minutes. If e no show, contact support.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Note */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Add Note (Optional) ✍️
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g., November contribution, Bonus savings..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition resize-none"
                rows={3}
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleStartTransfer}
              disabled={!amount || parseFloat(amount) < 300}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Transfer
            </button>
          </div>
        )}

        {/* Transfer Step - Bank Details & Receipt Upload */}
        {step === 'transfer' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Timer Section */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="text-center">
                <div className="text-sm font-medium mb-2 opacity-90">Time Remaining to Complete Transfer</div>
                <div className={`text-5xl font-bold font-mono ${timeLeft <= 60 ? 'animate-pulse' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                {timeLeft <= 60 && (
                  <div className="text-sm mt-2 bg-white/20 rounded-full px-3 py-1 inline-block">
                    Hurry! Time almost up
                  </div>
                )}
              </div>
            </div>

            {/* Amount to Transfer */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Amount to Transfer</div>
                <div className="text-4xl font-bold text-green-600">{formatCurrency(parseFloat(amount))}</div>
                <div className="text-sm text-gray-500 mt-1">to {plan?.emoji} {plan?.name}</div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">🏦</span>
                <div>
                  <h3 className="font-bold text-gray-900">Transfer to this Account</h3>
                  <p className="text-sm text-gray-600">Use your bank app or USSD to transfer</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bank Name</span>
                  <span className="font-bold text-gray-900">{platformBankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-bold text-gray-900">{platformBankDetails.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-green-600 font-mono">{platformBankDetails.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(platformBankDetails.accountNumber)
                        alert('Account number copied!')
                      }}
                      className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition active:scale-95"
                    >
                      <span className="text-lg">📋</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-xl text-green-600">{formatCurrency(parseFloat(amount))}</span>
                </div>
              </div>
            </div>

            {/* Receipt Upload Section */}
            <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">📎</span>
                <div>
                  <h3 className="font-bold text-gray-900">Upload Payment Receipt (Optional)</h3>
                  <p className="text-sm text-gray-600">Attach your transfer receipt for faster confirmation</p>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {receiptPreview ? (
                <div className="relative">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptFile(null)
                      setReceiptPreview(null)
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                  <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                    <span>✓</span>
                    Receipt attached: {receiptFile?.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 transition flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">📷</span>
                  <span className="font-medium">Tap to upload receipt</span>
                  <span className="text-xs">PNG, JPG up to 5MB</span>
                </button>
              )}
            </div>

            {/* Important Warning */}
            <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-700 mb-1">IMPORTANT!</h3>
                  <p className="text-sm text-red-700">
                    Do NOT click "I Have Made Payment" until your transfer is COMPLETE.
                    Make sure you have received a success message from your bank before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setStep('confirm')}
                disabled={timeLeft === 0}
                className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>I Have Made Payment</span>
                <span>✓</span>
              </button>

              {timeLeft === 0 && (
                <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <p className="text-sm text-orange-700">Time expired! Please start again if you haven't completed the transfer.</p>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('input')
                  setTimerActive(false)
                  setTimeLeft(TRANSFER_TIMEOUT)
                  setReceiptFile(null)
                  setReceiptPreview(null)
                }}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold transition hover:bg-gray-50 active:scale-95"
              >
                Cancel & Go Back
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {step === 'confirm' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Confirm Your Payment</h2>
              <p className="text-center text-gray-600 mb-6">Please verify the details below are correct</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{plan.emoji}</span>
                    {plan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount Transferred</span>
                  <span className="font-bold text-2xl text-green-600">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{paymentMethods.find(m => m.id === selectedMethod)?.icon}</span>
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Receipt Attached</span>
                  <span className={`font-bold ${receiptFile ? 'text-green-600' : 'text-gray-400'}`}>
                    {receiptFile ? '✓ Yes' : 'No'}
                  </span>
                </div>
                {note && (
                  <div className="flex justify-between items-start py-3 border-b border-gray-100">
                    <span className="text-gray-600">Note</span>
                    <span className="font-medium text-gray-900 text-right max-w-[200px]">{note}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(newTotal)}</span>
                </div>
              </div>

              {/* Receipt Preview if attached */}
              {receiptPreview && (
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-700 mb-2">Attached Receipt:</div>
                  <img
                    src={receiptPreview}
                    alt="Receipt"
                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Payment Submitted</div>
                    <p className="text-sm text-gray-700">
                      By clicking confirm, you declare that you have made the transfer of {formatCurrency(parseFloat(amount))} to our account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('transfer')}
                  disabled={submitting}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-3xl animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10px',
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${2 + Math.random()}s`,
                    }}
                  >
                    {['🎉', '💰', '✨', '🎊', '💚'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}

            {/* Success Animation */}
            <div className="text-center animate-bounce-in">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <span className="text-5xl text-white">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-lg text-gray-600 mb-2">
                {contributionResult?.message || `You don enter another ${formatCurrency(parseFloat(amount))}`} 🎉
              </p>
              {contributionResult && contributionResult.days_covered > 1 && (
                <p className="text-sm text-green-600 font-medium">
                  Your payment covers {contributionResult.days_covered} days!
                </p>
              )}
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                  RECEIPT
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-bold text-green-600">{formatCurrency(parseFloat(amount))}</span>
                </div>
                {contributionResult && contributionResult.days_covered > 1 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Days Covered</span>
                    <span className="font-bold text-blue-600">{contributionResult.days_covered} days</span>
                  </div>
                )}
                {contributionResult && contributionResult.company_fee > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Service Fee (1st Day)</span>
                    <span className="font-bold text-orange-600">- {formatCurrency(contributionResult.company_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Added to Savings</span>
                  <span className="font-bold text-green-600">{formatCurrency(contributionResult?.member_savings || parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-bold">{plan.emoji} {plan.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-bold text-xl text-green-600">{formatCurrency(plan.current_amount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-primary">{Math.round(plan.progress_percentage || 0)}%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">{transactionRef}</span>
                </div>
              </div>

              {/* New Progress Bar */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Goal Progress</span>
                  <span className="text-sm font-bold text-green-600">{Math.round(plan.progress_percentage || 0)}%</span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${plan.progress_percentage || 0}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {formatCurrency(plan.remaining_amount || (plan.target_amount - plan.current_amount))} remaining to reach your goal
                </div>
              </div>
            </div>

            {/* Celebration Message */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🎊</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Well Done!</h3>
                  <p className="text-sm text-gray-700">
                    {contributionResult && contributionResult.days_covered > 1
                      ? `You don cover ${contributionResult.days_covered} days contributions! Keep am up! 💪`
                      : 'You dey on track! Small small, e go plenty. Keep am up and you go reach your target! 💪'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Alajo Savings',
                      text: `I just saved ${formatCurrency(contributionResult?.member_savings || parseFloat(amount))} towards my ${plan.name}! I'm now at ${Math.round(plan.progress_percentage || 0)}% of my goal. 💪 #SavingsSavesLife`,
                    })
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Share Achievement</span>
                <span>📤</span>
              </button>

              <button
                onClick={() => router.push(`/savings/${plan.id}`)}
                className="w-full py-4 border-2 border-primary text-primary rounded-full font-bold transition hover:bg-primary/5 active:scale-95"
              >
                View Plan Details
              </button>

              <button
                onClick={() => router.push('/savings')}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold transition hover:bg-gray-50 active:scale-95"
              >
                Back to Savings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
