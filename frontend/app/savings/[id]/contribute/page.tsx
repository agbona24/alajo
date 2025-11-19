'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { savingsAPI } from '@/lib/api'
import AppHeader from '@/components/AppHeader'
import LoadingScreen from '@/components/LoadingScreen'

interface SavingsPlan {
  id: number
  name: string
  emoji?: string
  target_amount: number
  current_amount: number
}

const paymentMethods = [
  { id: 'card', name: 'Debit Card', icon: '💳', color: 'from-blue-500 to-blue-600', description: 'Instant payment' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', color: 'from-green-500 to-green-600', description: 'Direct from account' },
  { id: 'wallet', name: 'Wallet', icon: '👛', color: 'from-purple-500 to-purple-600', description: 'Hajo wallet' },
]

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

export default function ContributePage() {
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<SavingsPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [note, setNote] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planId = Number(params.id)
        const planData = await savingsAPI.getPlan(planId)
        setPlan(planData)
      } catch (error) {
        console.error('Failed to fetch plan:', error)
        router.push('/savings')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPlan()
    }
  }, [params.id, router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!plan) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleContinue = () => {
    if (amount && parseFloat(amount) >= 300) {
      setError(null)
      setStep('confirm')
    }
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)

    try {
      await savingsAPI.contribute(plan.id, {
        amount: parseFloat(amount),
        payment_method: selectedMethod,
        reference: `TXN${Date.now()}`,
      })

      // Update local plan data
      setPlan({
        ...plan,
        current_amount: plan.current_amount + parseFloat(amount)
      })

      setStep('success')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error: any) {
      console.error('Contribution failed:', error)
      setError(error.response?.data?.message || 'Failed to process contribution. Please try again.')
      setStep('input')
    } finally {
      setSubmitting(false)
    }
  }

  const newTotal = plan.current_amount + (parseFloat(amount) || 0)
  const newProgress = Math.min(Math.round((newTotal / plan.target_amount) * 100), 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-safe">
      <AppHeader
        title={step === 'success' ? 'Success!' : 'Add Money'}
        subtitle={step === 'success' ? 'Contribution successful' : plan.name}
        showBack={step !== 'success'}
      />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 text-sm flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{plan.emoji || '💰'}</span>
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
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition active:scale-95 text-left ${
                      selectedMethod === method.id
                        ? `border-green-500 bg-gradient-to-br ${method.color} text-white shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        selectedMethod === method.id ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{method.name}</div>
                        <div className={`text-sm ${
                          selectedMethod === method.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {method.description}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id
                          ? 'border-white bg-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${method.color}`} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
              onClick={handleContinue}
              disabled={!amount || parseFloat(amount) < 300}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Confirmation Step */}
        {step === 'confirm' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Confirm Payment</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{plan.emoji || '💰'}</span>
                    {plan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-2xl text-green-600">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{paymentMethods.find(m => m.id === selectedMethod)?.icon}</span>
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                {note && (
                  <div className="flex justify-between items-start py-3 border-b border-gray-100">
                    <span className="text-gray-600">Note</span>
                    <span className="font-medium text-gray-900 text-right max-w-[200px]">{note}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">New Total</span>
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(newTotal)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Secure Payment</div>
                    <p className="text-sm text-gray-700">
                      Your payment is 100% secure. We use bank-level encryption to protect your money.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  disabled={submitting}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold transition hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
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
              <p className="text-lg text-gray-600 mb-6">
                You don enter another {formatCurrency(parseFloat(amount))} 🎉
              </p>
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
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-bold">{plan.emoji || '💰'} {plan.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-bold">{formatCurrency(newTotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-primary">{newProgress}%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">TXN{Date.now()}</span>
                </div>
              </div>

              {/* New Progress Bar */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Goal Progress</span>
                  <span className="text-sm font-bold text-green-600">{newProgress}%</span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${newProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {formatCurrency(plan.target_amount - newTotal)} remaining to reach your goal
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
                    You dey on track! Small small, e go plenty. Keep am up and you go reach your target! 💪
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
                      title: 'Hajo Savings',
                      text: `I just saved ${formatCurrency(parseFloat(amount))} towards my ${plan.name}! I'm now at ${newProgress}% of my goal. 💪 #SavingsSavesLife`,
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
