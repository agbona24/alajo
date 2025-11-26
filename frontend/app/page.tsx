'use client'

import { useLandingPageContent } from '@/hooks/useLandingPageContent'

export default function Home() {
  const { content, loading, error } = useLandingPageContent()

  // Show loading state or error
  if (loading || !content || !content.hero || !content.hero.title_line1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">💰</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🎯</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>📊</div>
        <div className="absolute bottom-20 right-40 text-3xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🔒</div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl shadow-sm z-50 animate-slide-down border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alajo
              </span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <a href="#features" className="hidden sm:block text-gray-700 hover:text-primary transition font-medium">
                Features
              </a>
              <a href="#how-it-works" className="hidden sm:block text-gray-700 hover:text-primary transition font-medium">
                How It Works
              </a>
              <a
                href="/login"
                className="px-4 md:px-6 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition font-semibold active:scale-95"
              >
                Login
              </a>
              <a
                href="/onboarding"
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition font-semibold active:scale-95"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-left text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {content.hero.badge_text}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {content.hero.title_line1}{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {content.hero.title_line1?.split(' ')?.slice(-2)?.join(' ') || ''}
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl">{content.hero.title_line2}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
                {content.hero.subtitle1}
              </p>

              <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed">
                {content.hero.subtitle2}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <a
                  href="/onboarding"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-xl transition font-semibold text-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{content.hero.cta_primary}</span>
                  <span>🚀</span>
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition font-semibold text-lg active:scale-95"
                >
                  {content.hero.cta_secondary}
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="font-medium">{content.hero.trust_1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="font-medium">{content.hero.trust_2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="font-medium">{content.hero.trust_3}</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="animate-fade-in-right relative">
              {/* Floating Coins Around Main Card */}
              <div className="absolute -top-4 left-10 text-5xl animate-float z-10">💰</div>
              <div className="absolute top-20 -right-4 text-4xl animate-float z-10" style={{ animationDelay: '0.5s' }}>💸</div>
              <div className="absolute bottom-20 -left-4 text-4xl animate-float z-10" style={{ animationDelay: '1s' }}>🎯</div>

              {/* Main Card */}
              <div className="relative max-w-md mx-auto">
                {/* Pulsing Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl animate-ping-slow"></div>

                {/* Card */}
                <div className="relative w-full h-96 bg-white rounded-3xl shadow-2xl p-6 animate-float">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 h-48 relative overflow-hidden">
                    {/* Animated Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 left-2 w-20 h-20 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 w-12 h-12 border-2 border-white rounded-full animate-ping"></div>
                    </div>

                    {/* Content */}
                    <div className="relative text-white">
                      <div className="text-sm opacity-90 mb-2">Total Savings</div>
                      <div className="text-4xl font-bold mb-1">₦2,450,000</div>
                      <div className="text-sm opacity-90">Across all plans</div>
                    </div>

                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">💰</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-sm text-gray-600">Active Goals</div>
                      <div className="text-2xl font-bold text-gray-900">8</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                      <div className="text-2xl mb-1">📈</div>
                      <div className="text-sm text-gray-600">This Month</div>
                      <div className="text-2xl font-bold text-gray-900">+15%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center animate-fade-in-up">
              <div className="text-3xl md:text-5xl font-bold mb-2">{content.stats.stat1_number}</div>
              <div className="text-sm md:text-base opacity-90">{content.stats.stat1_label}</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl md:text-5xl font-bold mb-2">{content.stats.stat2_number}</div>
              <div className="text-sm md:text-base opacity-90">{content.stats.stat2_label}</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-5xl font-bold mb-2">{content.stats.stat3_number}</div>
              <div className="text-sm md:text-base opacity-90">{content.stats.stat3_label}</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl md:text-5xl font-bold mb-2">{content.stats.stat4_number}</div>
              <div className="text-sm md:text-base opacity-90">{content.stats.stat4_label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                WHY CHOOSE Alajo
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.features.section_title}</h2>
            <p className="text-lg md:text-xl text-gray-600">{content.features.section_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={content.features.feature1_icon}
              title={content.features.feature1_title}
              description={content.features.feature1_desc}
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={content.features.feature2_icon}
              title={content.features.feature2_title}
              description={content.features.feature2_desc}
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={content.features.feature3_icon}
              title={content.features.feature3_title}
              description={content.features.feature3_desc}
              gradient="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={content.features.feature4_icon}
              title={content.features.feature4_title}
              description={content.features.feature4_desc}
              gradient="from-yellow-500 to-orange-600"
            />
            <FeatureCard
              icon={content.features.feature5_icon}
              title={content.features.feature5_title}
              description={content.features.feature5_desc}
              gradient="from-pink-500 to-rose-600"
            />
            <FeatureCard
              icon={content.features.feature6_icon}
              title={content.features.feature6_title}
              description={content.features.feature6_desc}
              gradient="from-indigo-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EASY AS 1-2-3
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.how_it_works.section_title}</h2>
            <p className="text-lg md:text-xl text-gray-600">{content.how_it_works.section_subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Step
              number={parseInt(content.how_it_works.step1_number)}
              title={content.how_it_works.step1_title}
              description={content.how_it_works.step1_desc}
              gradient="from-purple-500 to-purple-600"
            />
            <Step
              number={parseInt(content.how_it_works.step2_number)}
              title={content.how_it_works.step2_title}
              description={content.how_it_works.step2_desc}
              gradient="from-blue-500 to-blue-600"
            />
            <Step
              number={parseInt(content.how_it_works.step3_number)}
              title={content.how_it_works.step3_title}
              description={content.how_it_works.step3_desc}
              gradient="from-green-500 to-green-600"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.testimonials.section_title}</h2>
            <p className="text-lg md:text-xl text-gray-600">{content.testimonials.section_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote={content.testimonials.testimonial1_text}
              name={content.testimonials.testimonial1_name}
              role={content.testimonials.testimonial1_role}
              avatar={content.testimonials.testimonial1_avatar}
            />
            <TestimonialCard
              quote={content.testimonials.testimonial2_text}
              name={content.testimonials.testimonial2_name}
              role={content.testimonials.testimonial2_role}
              avatar={content.testimonials.testimonial2_avatar}
            />
            <TestimonialCard
              quote={content.testimonials.testimonial3_text}
              name={content.testimonials.testimonial3_name}
              role={content.testimonials.testimonial3_role}
              avatar={content.testimonials.testimonial3_avatar}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary via-secondary to-primary text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-6 animate-bounce-in">💰</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.cta.title}</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {content.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href="/onboarding"
              className="px-8 py-4 bg-white text-primary rounded-full hover:bg-gray-100 transition font-semibold text-lg active:scale-95 shadow-xl"
            >
              {content.cta.button_text}
            </a>
            <a
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-primary transition font-semibold text-lg active:scale-95"
            >
              Login to Dashboard
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm opacity-90">
            <div className="text-center">
              <span>{content.cta.subtext}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
                <span className="text-xl font-bold">Alajo</span>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-semibold">
                {content.footer.tagline}
              </p>
              <p className="text-gray-400 text-sm">
                {content.footer.description}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="/onboarding" className="hover:text-white transition">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>{content.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }: {
  icon: string
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group p-6 md:p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl md:text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  )
}

function Step({ number, title, description, gradient }: {
  number: number
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="text-center group">
      <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${gradient} text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, role, avatar }: {
  quote: string
  name: string
  role: string
  avatar: string
}) {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="text-4xl mb-4">{avatar}</div>
      <p className="text-gray-700 mb-4 italic leading-relaxed">"{quote}"</p>
      <div>
        <div className="font-bold text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
      <div className="flex gap-1 mt-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">⭐</span>
        ))}
      </div>
    </div>
  )
}
