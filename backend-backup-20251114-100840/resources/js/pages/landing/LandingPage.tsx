import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import {
  Wallet,
  TrendingUp,
  Shield,
  Users,
  Target,
  Zap,
  Award,
  PiggyBank,
  BarChart3,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="container-custom py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Alajo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Save Money,{' '}
            <span className="text-primary-600">Build Wealth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Alajo helps you save consistently with automated daily, weekly, or
            monthly contributions. Achieve your financial goals faster with
            smart savings plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Saving Today
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image/Illustration Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
              <p className="text-white text-2xl font-semibold">
                App Screenshot / Illustration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Alajo?
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to build a strong savings habit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container-custom py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-custom py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Join Thousands of Smart Savers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-20">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Savings Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already achieving their financial
            goals with Alajo.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PiggyBank className="h-6 w-6 text-primary-600" />
                <span className="text-lg font-bold text-gray-900">Alajo</span>
              </div>
              <p className="text-gray-600 text-sm">
                Building wealth through smart savings, one day at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2025 Alajo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <Wallet className="h-6 w-6 text-primary-600" />,
    title: 'Flexible Savings',
    description:
      'Choose daily, weekly, or monthly savings plans that fit your lifestyle and income.',
  },
  {
    icon: <Zap className="h-6 w-6 text-primary-600" />,
    title: 'Automated Savings',
    description:
      'Set it and forget it. Automatic deductions make saving effortless.',
  },
  {
    icon: <Target className="h-6 w-6 text-primary-600" />,
    title: 'Goal Tracking',
    description:
      'Set financial goals and watch your progress with beautiful visualizations.',
  },
  {
    icon: <Shield className="h-6 w-6 text-primary-600" />,
    title: 'Bank-Level Security',
    description:
      'Your money and data are protected with industry-leading encryption.',
  },
  {
    icon: <Users className="h-6 w-6 text-primary-600" />,
    title: 'Group Savings',
    description:
      'Save together with friends and family in traditional Ajo-style groups.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary-600" />,
    title: 'Smart Analytics',
    description:
      'Get insights into your savings patterns and optimize your financial health.',
  },
  {
    icon: <Award className="h-6 w-6 text-primary-600" />,
    title: 'Rewards & Badges',
    description:
      'Earn achievements and rewards for consistent savings habits.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary-600" />,
    title: 'Instant Withdrawals',
    description:
      'Access your money anytime with instant or scheduled withdrawals.',
  },
  {
    icon: <PiggyBank className="h-6 w-6 text-primary-600" />,
    title: 'Multiple Goals',
    description:
      'Save for different purposes simultaneously - vacation, emergency fund, and more.',
  },
];

const steps = [
  {
    title: 'Create Account',
    description: 'Sign up in seconds with your email and create your profile.',
  },
  {
    title: 'Set Up Savings Plan',
    description:
      'Choose your savings frequency and amount that works for you.',
  },
  {
    title: 'Watch It Grow',
    description:
      'Sit back and watch your savings grow automatically every day.',
  },
];

const stats = [
  {
    value: '10,000+',
    label: 'Active Savers',
  },
  {
    value: '₦100M+',
    label: 'Total Saved',
  },
  {
    value: '99.9%',
    label: 'Success Rate',
  },
];
