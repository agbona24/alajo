'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              💰 Hajo
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden sm:block text-gray-700 hover:text-primary transition">
                Features
              </a>
              <a href="#how-it-works" className="hidden sm:block text-gray-700 hover:text-primary transition">
                How It Works
              </a>
              <a
                href="/login"
                className="px-6 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition font-semibold"
              >
                Login
              </a>
              <a
                href="/onboarding"
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Save Smarter with{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Digital Ajo
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Traditional savings meet modern technology. Join thousands saving together through our trusted digital platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/onboarding"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-xl transition font-semibold text-lg"
                >
                  Start Saving Now
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition font-semibold text-lg"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="animate-fade-in-right">
              <div className="relative">
                <div className="w-full max-w-md mx-auto h-96 bg-white rounded-3xl shadow-2xl p-5 animate-float">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-2xl flex flex-col items-center justify-center text-white">
                    <div className="text-6xl mb-4">💰</div>
                    <div className="text-3xl font-bold">Hajo</div>
                    <div className="text-sm mt-2 opacity-90">Your Savings Partner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Hajo?</h2>
            <p className="text-xl text-gray-600">Everything you need to grow your savings, digitally</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon="🎯" title="Goal-Based Savings" description="Set your financial goals and watch your savings grow automatically with our smart savings plans." />
            <FeatureCard icon="📊" title="Track Progress" description="Monitor your savings journey with beautiful analytics and detailed contribution history." />
            <FeatureCard icon="🔒" title="100% Secure" description="Bank-level encryption and security measures to keep your money and data safe." />
            <FeatureCard icon="⚡" title="Instant Withdrawals" description="Access your savings anytime with quick withdrawal processing and approval." />
            <FeatureCard icon="📱" title="Mobile First" description="Save on the go with our responsive platform that works on any device." />
            <FeatureCard icon="👥" title="Community Savings" description="Join traditional ajo groups digitally and save together with friends and family." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Start your savings journey in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Step number={1} title="Create Account" description="Sign up in seconds with just your email and password" />
            <Step number={2} title="Set Your Goal" description="Create savings plans with target amounts and frequencies" />
            <Step number={3} title="Start Saving" description="Make contributions daily, weekly, or monthly" />
            <Step number={4} title="Reach Your Goal" description="Withdraw anytime or let your savings grow" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of Nigerians achieving their financial goals with Hajo</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/onboarding"
              className="px-8 py-4 bg-white text-primary rounded-full hover:bg-gray-100 transition font-semibold text-lg"
            >
              Create Free Account
            </a>
            <a
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-primary transition font-semibold text-lg"
            >
              Login to Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="opacity-80">&copy; 2024 Hajo. Savings Saves Life. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition duration-300 hover:-translate-y-2">
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
