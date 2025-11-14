'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const onboardingSlides = [
  {
    id: 1,
    title: "Welcome to Hajo",
    subtitle: "Save Together, Prosper Together",
    description: "Join the digital revolution of traditional Nigerian ajo savings",
    illustration: "🎯",
    gradient: "from-purple-600 via-purple-500 to-pink-500",
    pattern: "dots"
  },
  {
    id: 2,
    title: "Traditional Ajo",
    subtitle: "Modernized",
    description: "Experience the trust and community of ajo with the convenience of technology",
    illustration: "🤝",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    pattern: "circles"
  },
  {
    id: 3,
    title: "Save Smart",
    subtitle: "Achieve Your Goals",
    description: "Set targets, track progress, and watch your savings grow with ease",
    illustration: "💰",
    gradient: "from-green-600 via-green-500 to-emerald-500",
    pattern: "waves"
  },
  {
    id: 4,
    title: "Secure & Trusted",
    subtitle: "Your Money, Safe",
    description: "Bank-level security protecting your savings every step of the way",
    illustration: "🔒",
    gradient: "from-orange-600 via-orange-500 to-amber-500",
    pattern: "grid"
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      nextSlide()
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      prevSlide()
    }
  }

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const skip = () => {
    router.push('/login')
  }

  const getStarted = () => {
    router.push('/register')
  }

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundPattern type={onboardingSlides[currentSlide].pattern} />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center p-4 pt-safe">
        <button
          onClick={skip}
          className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
          Skip
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hajo
          </span>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Slides Container */}
      <div
        ref={containerRef}
        className="relative h-full pt-16 pb-32"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {onboardingSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="min-w-full flex flex-col items-center justify-center px-8"
            >
              {/* Illustration Circle */}
              <div className={`relative mb-12 animate-float`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center relative overflow-hidden shadow-2xl`}>
                  {/* Animated rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-white/30 animate-ping-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 rounded-full border-2 border-white/20 animate-ping-slower"></div>
                  </div>

                  {/* Main illustration */}
                  <div className="relative z-10 text-9xl filter drop-shadow-2xl">
                    {slide.illustration}
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-4 right-8 w-3 h-3 bg-white rounded-full animate-float-particle"></div>
                  <div className="absolute bottom-8 left-12 w-2 h-2 bg-white/70 rounded-full animate-float-particle-delayed"></div>
                  <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/50 rounded-full animate-float-particle-slow"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center max-w-sm animate-fade-in-up">
                <div className="mb-2">
                  <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${slide.gradient} text-white text-xs font-bold mb-4`}>
                    STEP {slide.id}/4
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {slide.title}
                </h1>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent mb-4`}>
                  {slide.subtitle}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-6 pb-safe z-20">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="transition-all duration-300"
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `bg-gradient-to-r ${onboardingSlides[currentSlide].gradient} w-8 h-2`
                    : 'bg-gray-300 w-2 h-2'
                }`}
              ></div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {currentSlide === onboardingSlides.length - 1 ? (
          <button
            onClick={getStarted}
            className={`w-full py-4 bg-gradient-to-r ${onboardingSlides[currentSlide].gradient} text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform`}
          >
            Get Started 🚀
          </button>
        ) : (
          <button
            onClick={nextSlide}
            className={`w-full py-4 bg-gradient-to-r ${onboardingSlides[currentSlide].gradient} text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform`}
          >
            Continue
          </button>
        )}

        {/* Already have account */}
        <button
          onClick={() => router.push('/login')}
          className="w-full mt-3 py-3 text-gray-600 font-semibold"
        >
          Already have an account? <span className="text-primary">Sign In</span>
        </button>
      </div>
    </div>
  )
}

// Background Pattern Components
function BackgroundPattern({ type }: { type: string }) {
  switch (type) {
    case 'dots':
      return (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #667eea 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
      )
    case 'circles':
      return (
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-blue-400"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
                animation: `float-circle ${3 + i}s ease-in-out infinite`
              }}
            ></div>
          ))}
        </div>
      )
    case 'waves':
      return (
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z"
              fill="#10b981"
              className="animate-wave"
            />
          </svg>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z"
              fill="#059669"
              className="animate-wave-delayed"
            />
          </svg>
        </div>
      )
    case 'grid':
      return (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      )
    default:
      return null
  }
}

// Add custom animations to globals.css
