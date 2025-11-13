import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Select,
} from '../../components/common';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
const savingsGrowthData = [
  { month: 'Jan', savings: 5000, target: 10000, deposits: 6000, withdrawals: 1000 },
  { month: 'Feb', savings: 12000, target: 20000, deposits: 8000, withdrawals: 1000 },
  { month: 'Mar', savings: 18000, target: 30000, deposits: 7000, withdrawals: 1000 },
  { month: 'Apr', savings: 25000, target: 40000, deposits: 9000, withdrawals: 2000 },
  { month: 'May', savings: 32000, target: 50000, deposits: 10000, withdrawals: 3000 },
  { month: 'Jun', savings: 38000, target: 60000, deposits: 8000, withdrawals: 2000 },
];

const planPerformanceData = [
  { plan: 'Emergency', saved: 38000, target: 100000, rate: 38 },
  { plan: 'Vacation', saved: 25000, target: 50000, rate: 50 },
  { plan: 'Laptop', saved: 15000, target: 200000, rate: 7.5 },
];

const categoryDistribution = [
  { name: 'Emergency Fund', value: 38000, color: '#10B981' },
  { name: 'Vacation', value: 25000, color: '#3B82F6' },
  { name: 'New Laptop', value: 15000, color: '#F59E0B' },
];

const savingsRateData = [
  { week: 'Week 1', rate: 25 },
  { week: 'Week 2', rate: 35 },
  { week: 'Week 3', rate: 42 },
  { week: 'Week 4', rate: 38 },
];

const performanceMetrics = [
  { metric: 'Consistency', score: 85, fullMark: 100 },
  { metric: 'Goal Progress', score: 65, fullMark: 100 },
  { metric: 'Savings Rate', score: 75, fullMark: 100 },
  { metric: 'Discipline', score: 90, fullMark: 100 },
  { metric: 'Growth', score: 70, fullMark: 100 },
];

const incomeVsExpenseData = [
  { month: 'Jan', income: 150000, expenses: 100000, savings: 50000 },
  { month: 'Feb', income: 150000, expenses: 95000, savings: 55000 },
  { month: 'Mar', income: 160000, expenses: 105000, savings: 55000 },
  { month: 'Apr', income: 150000, expenses: 90000, savings: 60000 },
  { month: 'May', income: 170000, expenses: 100000, savings: 70000 },
  { month: 'Jun', income: 165000, expenses: 98000, savings: 67000 },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const stats = [
    {
      title: 'Total Saved',
      value: '₦78,000',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      title: 'Savings Rate',
      value: '38%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Goal Achievement',
      value: '31.7%',
      change: '+8.1%',
      trend: 'up',
      icon: Target,
      color: 'blue',
    },
    {
      title: 'Avg. Monthly',
      value: '₦13k',
      change: '-2.3%',
      trend: 'down',
      icon: Calendar,
      color: 'yellow',
    },
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getIconBgColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-100',
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      yellow: 'bg-yellow-100',
    };
    return colors[color] || 'bg-gray-100';
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'text-primary-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 pb-20 sm:pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Deep insights into your savings journey
          </p>
        </div>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { value: '1month', label: '1 Month' },
            { value: '3months', label: '3 Months' },
            { value: '6months', label: '6 Months' },
            { value: '1year', label: '1 Year' },
          ]}
          className="w-32"
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${getIconBgColor(
                        stat.color
                      )} rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${getIconColor(
                          stat.color
                        )}`}
                      />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs sm:text-sm flex items-center ${getTrendColor(
                      stat.trend
                    )}`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Savings Growth & Target */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Savings Growth vs Target</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={savingsGrowthData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
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
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                  name="Actual Savings"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Income vs Expenses */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Income vs Expenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
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
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#10B981"
                  radius={[8, 8, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expenses"
                  fill="#EF4444"
                  radius={[8, 8, 0, 0]}
                  name="Expenses"
                />
                <Bar
                  dataKey="savings"
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                  name="Savings"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Plan Performance */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Plan Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planPerformanceData.map((plan, index) => (
                  <motion.div
                    key={plan.plan}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {plan.plan}
                        </p>
                        <p className="text-xs text-gray-600">
                          ₦{plan.saved.toLocaleString()} / ₦
                          {plan.target.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={plan.rate >= 50 ? 'success' : 'warning'}
                        size="sm"
                      >
                        {plan.rate}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${plan.rate}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          plan.rate >= 50 ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5" />
                <span>Savings Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ₦${(value / 1000).toFixed(0)}k`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₦${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Two Column Layout 2 */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Savings Rate Trend */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Savings Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={savingsRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="score"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deposits vs Withdrawals */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Deposits vs Withdrawals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
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
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Legend />
                <Bar
                  dataKey="deposits"
                  fill="#10B981"
                  radius={[8, 8, 0, 0]}
                  name="Deposits"
                />
                <Bar
                  dataKey="withdrawals"
                  fill="#EF4444"
                  radius={[8, 8, 0, 0]}
                  name="Withdrawals"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
