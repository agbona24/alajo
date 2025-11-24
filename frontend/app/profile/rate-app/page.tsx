'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import { toast } from '@/lib/utils/toast'

export default function RateAppPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
        <AppHeader title="Rate Alajo" showBack />

        <div className="px-4 pt-16 pb-8 max-w-2xl mx-auto text-center">
          <div className="animate-bounce-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-5xl">💚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-8">
              Your feedback helps us improve Alajo for everyone.
            </p>
            <button
              onClick={() => router.push('/profile')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-safe">
      <AppHeader title="Rate Alajo" showBack />

      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Header */}
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">⭐</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">How would you rate Alajo?</h2>
            <p className="text-gray-600 text-sm">Your feedback helps us improve</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-4xl transition-transform hover:scale-110 active:scale-95"
              >
                {star <= (hoveredRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {rating > 0 && (
            <p className="text-center text-lg font-medium text-gray-700 animate-fade-in">
              {rating === 1 && 'Poor - Needs improvement'}
              {rating === 2 && 'Fair - Could be better'}
              {rating === 3 && 'Good - Works well'}
              {rating === 4 && 'Great - Love it!'}
              {rating === 5 && 'Excellent - Amazing!'}
            </p>
          )}

          {/* Feedback */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Share your thoughts (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              placeholder="Tell us what you love or what we can improve..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  )
}
