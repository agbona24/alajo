'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { savingsAPI } from '@/lib/api'
import useAPI from '@/lib/hooks/useAPI'
import { toast } from '@/lib/utils/toast'

const planEmojis = ['🎯', '💰', '🏠', '🚗', '📱', '💍', '🎓', '✈️', '🏥', '👶', '🎉', '💼', '🏍️', '⚽', '🎸', '📚']

const MINIMUM_DAILY_AMOUNT = 300
const DAYS_PER_MONTH = 31 // Ajo policy: 31 days = 1 month

const frequencies = [
  { value: 'daily', label: 'Daily', description: 'Save small small every day', icon: '📅', available: true },
  { value: 'weekly', label: 'Weekly', description: 'Save every week', icon: '📆', available: false },
  { value: 'monthly', label: 'Monthly', description: 'Save every month', icon: '🗓️', available: false },
]

const planTypes = [
  {
    value: 'personal',
    label: 'Personal Goal',
    description: 'Na only you dey save for this goal',
    icon: '👤',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    value: 'group',
    label: 'Group Ajo',
    description: 'Save with your people together',
    icon: '👥',
    gradient: 'from-blue-500 to-blue-600'
  },
]

export default function CreateSavingsPlan() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    dailyAmount: '',
    frequency: 'daily',
    duration: '1', // Default to 1 month
    planType: 'personal',
    description: '',
  })

  // Calculate amounts based on daily contribution
  const dailyAmountNum = parseFloat(formData.dailyAmount) || 0
  const durationNum = parseInt(formData.duration) || 1
  const totalContribution = dailyAmountNum * DAYS_PER_MONTH * durationNum // Total you will contribute
  const companyFee = dailyAmountNum * durationNum // First day of each month goes to company
  const payoutAmount = totalContribution - companyFee // What you receive at the end
  const { loading, execute } = useAPI()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await execute(() => savingsAPI.createPlan({
        name: formData.name,
        emoji: formData.emoji,
        daily_amount: dailyAmountNum, // The user's chosen daily contribution
        target_amount: payoutAmount, // The actual payout amount after company fee
        frequency: formData.frequency,
        duration: parseInt(formData.duration),
        plan_type: formData.planType,
        description: formData.description,
      }))

      toast.success('Savings plan created successfully! 🎉')
      router.push('/savings')
    } catch (error) {
      toast.error('Failed to create savings plan. Please try again.')
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Create Savings Plan" />

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm font-medium text-primary">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Plan Type & Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Plan Type Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Wetin you wan save for?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {planTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateFormData('planType', type.value)}
                      className={`p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${
                        formData.planType === type.value
                          ? `border-primary bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                          : 'border-gray-200 bg-white hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          formData.planType === type.value
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                        }`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{type.label}</div>
                          <div className={`text-sm ${
                            formData.planType === type.value
                              ? 'text-white/90'
                              : 'text-gray-600'
                          }`}>
                            {type.description}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.planType === type.value
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`}>
                          {formData.planType === type.value && (
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${type.gradient}`} />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="e.g., iPhone 15 Fund, School Fees, Wedding Savings"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Give your savings plan a catchy name</p>
              </div>

              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {planEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => updateFormData('emoji', emoji)}
                      className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all active:scale-95 ${
                        formData.emoji === emoji
                          ? 'bg-gradient-to-br from-primary to-secondary shadow-lg scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Contribution
              </button>
            </div>
          )}

          {/* Step 2: Daily Contribution & Duration */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Daily Contribution Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  How much you wan contribute daily? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₦</span>
                  <input
                    type="number"
                    value={formData.dailyAmount}
                    onChange={(e) => updateFormData('dailyAmount', e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-lg font-bold"
                    min={MINIMUM_DAILY_AMOUNT}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum daily contribution: ₦{MINIMUM_DAILY_AMOUNT}</p>

                {/* Quick Amount Suggestions */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['500', '1000', '2000', '5000'].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => updateFormData('dailyAmount', amount)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition active:scale-95 ${
                        formData.dailyAmount === amount
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-primary/10'
                      }`}
                    >
                      ₦{parseInt(amount).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration (Months) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '3', '6', '12'].map((month) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => updateFormData('duration', month)}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition active:scale-95 ${
                        formData.duration === month
                          ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
                          : 'bg-gray-100 hover:bg-primary/10'
                      }`}
                    >
                      {month} {parseInt(month) === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">1 month = {DAYS_PER_MONTH} days (Ajo policy)</p>
              </div>

              {/* Calculated Payout Summary */}
              {dailyAmountNum >= MINIMUM_DAILY_AMOUNT && (
                <div className="space-y-3 animate-fade-in-up">
                  {/* Total Contribution */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💰</span>
                      <span className="font-bold text-gray-900">Total Contribution</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ₦{totalContribution.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₦{dailyAmountNum.toLocaleString()} x {DAYS_PER_MONTH} days x {durationNum} {durationNum === 1 ? 'month' : 'months'}
                    </div>
                  </div>

                  {/* Company Fee Explanation */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🏢</span>
                      <span className="font-bold text-gray-900">Service Fee (1st Day of Each Month)</span>
                    </div>
                    <div className="text-xl font-bold text-orange-600 mb-1">
                      - ₦{companyFee.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      First day contribution goes to the company ({durationNum} x ₦{dailyAmountNum.toLocaleString()})
                    </div>
                  </div>

                  {/* Final Payout */}
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🎉</span>
                      <span className="font-bold text-lg text-gray-900">Your Payout</span>
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ₦{payoutAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      This is what you go receive at the end of {durationNum} {durationNum === 1 ? 'month' : 'months'}
                    </div>
                    <div className="mt-3 p-2 bg-white rounded-lg text-xs text-gray-500">
                      Calculation: ₦{totalContribution.toLocaleString()} - ₦{companyFee.toLocaleString()} = ₦{payoutAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Warning */}
              {formData.dailyAmount && dailyAmountNum < MINIMUM_DAILY_AMOUNT && (
                <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                  <div className="flex items-center gap-3 text-red-600">
                    <span className="text-2xl">⚠️</span>
                    <span className="font-medium">Minimum daily contribution is ₦{MINIMUM_DAILY_AMOUNT}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition active:scale-95"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.dailyAmount || dailyAmountNum < MINIMUM_DAILY_AMOUNT}
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description & Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Plan Summary Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-6xl mb-2">{formData.emoji}</div>
                    <h3 className="text-2xl font-bold mb-1">{formData.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{planTypes.find(t => t.value === formData.planType)?.icon}</span>
                      <span>{planTypes.find(t => t.value === formData.planType)?.label}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Daily Contribution</span>
                    <span className="font-bold text-xl">₦{dailyAmountNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Duration</span>
                    <span className="font-bold">{durationNum} {durationNum === 1 ? 'month' : 'months'} ({DAYS_PER_MONTH * durationNum} days)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Contribution</span>
                    <span className="font-bold">₦{totalContribution.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Service Fee (1st Day)</span>
                    <span className="font-bold">- ₦{companyFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="text-white/80">Your Payout</span>
                    <span className="font-bold text-2xl text-green-300">₦{payoutAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Add Motivation (Optional) ✨
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Why this goal matter to you? E go help you stay motivated!"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base resize-none"
                  rows={4}
                />
              </div>

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Pro Tip!</div>
                    <div className="text-sm text-gray-600">
                      Small small contributions dey work pass big big amounts wey you no fit maintain.
                      Be consistent, you go reach your goal! 🎯
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span>Creating...</span>
                      <span className="animate-spin">⏳</span>
                    </>
                  ) : (
                    <>
                      <span>Create Plan</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              Weekly and Monthly savings plans are currently being developed. For now, please enjoy our Daily savings feature with a minimum of ₦{MINIMUM_DAILY_AMOUNT} per day.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We'll notify you when these features become available. Stay tuned! 🎉
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
