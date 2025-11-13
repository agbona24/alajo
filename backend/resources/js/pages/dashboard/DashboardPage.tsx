import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '../../components/common';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  PiggyBank,
  ArrowDownRight,
  Plus,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// Sample data
const savingsData = [
  { month: 'Jan', amount: 5000 },
  { month: 'Feb', amount: 12000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 25000 },
  { month: 'May', amount: 32000 },
  { month: 'Jun', amount: 38000 },
];

const planDistribution = [
  { name: 'Daily', value: 45, color: '#10B981' },
  { name: 'Weekly', value: 30, color: '#3B82F6' },
  { name: 'Monthly', value: 25, color: '#F59E0B' },
];

const recentTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    plan: 'Emergency Fund',
    date: 'Today',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 3000,
    plan: 'Vacation Savings',
    date: 'Yesterday',
    time: '2:15 PM',
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 10000,
    plan: 'Emergency Fund',
    date: '3 days ago',
    time: '9:00 AM',
  },
];

export const DashboardPage: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 pb-20 sm:pb-8"
    >
      {/* Page Header - Mobile Optimized */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome back! 👋
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="flex items-center space-x-2 shadow-lg">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Plan</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Grid - Swipeable on Mobile */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        {/* Total Savings */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Savings
                  </p>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₦38k
                </p>
                <p className="text-xs sm:text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  +12%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Plans */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Plans
                  </p>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs sm:text-sm text-gray-500">2 daily, 1 weekly</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* This Month */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₦6k
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Amount saved</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Streak */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Streak
                  </p>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg sm:text-xl">🔥</span>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  45
                </p>
                <p className="text-xs sm:text-sm text-gray-500">days</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Row - Mobile Stacked */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Savings Growth Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Savings Growth</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `₦${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [
                      `₦${value.toLocaleString()}`,
                      'Savings',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-2">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">
                  New Plan
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">
                  Deposit
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <ArrowDownRight className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">
                  Withdraw
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">
                  Goals
                </span>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions - Mobile List */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </motion.button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'deposit' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {transaction.plan}
                      </p>
                      <p className="text-xs text-gray-600">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm sm:text-base font-semibold ${
                        transaction.type === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}₦
                      {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
