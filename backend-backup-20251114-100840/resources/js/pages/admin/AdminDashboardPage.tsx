import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '../../components/common';
import {
  Users,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Eye,
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
const platformGrowthData = [
  { month: 'Jan', users: 120, savings: 500000 },
  { month: 'Feb', users: 250, savings: 1200000 },
  { month: 'Mar', users: 420, savings: 2100000 },
  { month: 'Apr', users: 680, savings: 3500000 },
  { month: 'May', users: 950, savings: 5000000 },
  { month: 'Jun', users: 1250, savings: 7200000 },
];

const userActivityData = [
  { day: 'Mon', active: 850, inactive: 400 },
  { day: 'Tue', active: 920, inactive: 330 },
  { day: 'Wed', active: 780, inactive: 470 },
  { day: 'Thu', active: 1050, inactive: 200 },
  { day: 'Fri', active: 1100, inactive: 150 },
  { day: 'Sat', active: 650, inactive: 600 },
  { day: 'Sun', active: 580, inactive: 670 },
];

const planTypeDistribution = [
  { name: 'Daily', value: 55, color: '#10B981' },
  { name: 'Weekly', value: 30, color: '#3B82F6' },
  { name: 'Monthly', value: 15, color: '#F59E0B' },
];

const recentUsers = [
  {
    id: 'USR001',
    name: 'John Doe',
    email: 'john@example.com',
    joined: '2 hours ago',
    status: 'active',
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    joined: '5 hours ago',
    status: 'active',
  },
  {
    id: 'USR003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    joined: '1 day ago',
    status: 'pending',
  },
];

const pendingWithdrawals = [
  {
    id: 'WD001',
    user: 'John Doe',
    amount: 50000,
    plan: 'Emergency Fund',
    date: '2025-11-13',
    status: 'pending',
  },
  {
    id: 'WD002',
    user: 'Sarah Williams',
    amount: 25000,
    plan: 'Vacation',
    date: '2025-11-12',
    status: 'pending',
  },
  {
    id: 'WD003',
    user: 'David Brown',
    amount: 15000,
    plan: 'New Laptop',
    date: '2025-11-12',
    status: 'pending',
  },
];

export const AdminDashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const stats = [
    {
      title: 'Total Users',
      value: '1,250',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'primary',
      bg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Total Savings',
      value: '₦7.2M',
      change: '+25.5%',
      trend: 'up',
      icon: Wallet,
      color: 'green',
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Active Plans',
      value: '3,450',
      change: '+12.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Daily Active',
      value: '845',
      change: '-3.2%',
      trend: 'down',
      icon: Activity,
      color: 'yellow',
      bg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      active: 'success',
      pending: 'warning',
      suspended: 'danger',
      inactive: 'info',
    };
    return variants[status] || 'default';
  };

  const handleApproveWithdrawal = (id: string) => {
    console.log('Approving withdrawal:', id);
  };

  const handleRejectWithdrawal = (id: string) => {
    console.log('Rejecting withdrawal:', id);
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
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Platform overview and management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm" className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span>System Healthy</span>
          </Badge>
        </div>
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
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs sm:text-sm flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Platform Growth Chart */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Platform Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={platformGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Users"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="savings"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                  name="Total Savings (₦)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Activity */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>User Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="active"
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                    name="Active Users"
                  />
                  <Bar
                    dataKey="inactive"
                    fill="#EF4444"
                    radius={[8, 8, 0, 0]}
                    name="Inactive Users"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Type Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Plan Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={planTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planTypeDistribution.map((entry, index) => (
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

      {/* Recent Users */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Recent Users</span>
              </CardTitle>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>User ID</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader className="hidden sm:table-cell">Email</TableHeader>
                    <TableHeader>Joined</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-sm">{user.joined}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(user.status)} size="sm">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Withdrawals */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Pending Withdrawals</span>
                <Badge variant="warning" size="sm">
                  {pendingWithdrawals.length}
                </Badge>
              </CardTitle>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Plan</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader className="hidden sm:table-cell">Date</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-mono text-xs">
                        {withdrawal.id}
                      </TableCell>
                      <TableCell className="font-medium">{withdrawal.user}</TableCell>
                      <TableCell className="text-sm">{withdrawal.plan}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ₦{withdrawal.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                        {withdrawal.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
