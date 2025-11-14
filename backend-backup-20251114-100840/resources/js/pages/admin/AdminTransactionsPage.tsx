import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Modal,
  ModalFooter,
} from '../../components/common';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Wallet,
  Users,
  DollarSign,
} from 'lucide-react';

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

// Mock transaction data
const mockTransactions = [
  {
    id: 'TXN001',
    user: 'John Doe',
    userId: 'USR001',
    type: 'deposit',
    amount: 5000,
    plan: 'Emergency Fund',
    status: 'completed',
    paymentMethod: 'Card',
    reference: 'PAY-1234567890',
    date: '2025-11-13 10:30 AM',
  },
  {
    id: 'TXN002',
    user: 'Jane Smith',
    userId: 'USR002',
    type: 'deposit',
    amount: 10000,
    plan: 'Vacation',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    reference: 'PAY-0987654321',
    date: '2025-11-13 09:15 AM',
  },
  {
    id: 'TXN003',
    user: 'Mike Johnson',
    userId: 'USR003',
    type: 'withdrawal',
    amount: 3000,
    plan: 'New Laptop',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    reference: 'WTH-1234567890',
    date: '2025-11-13 08:45 AM',
  },
  {
    id: 'TXN004',
    user: 'Sarah Williams',
    userId: 'USR004',
    type: 'deposit',
    amount: 25000,
    plan: 'House Savings',
    status: 'completed',
    paymentMethod: 'Card',
    reference: 'PAY-5555555555',
    date: '2025-11-12 04:20 PM',
  },
  {
    id: 'TXN005',
    user: 'David Brown',
    userId: 'USR005',
    type: 'withdrawal',
    amount: 8000,
    plan: 'Emergency Fund',
    status: 'failed',
    paymentMethod: 'Bank Transfer',
    reference: 'WTH-9999999999',
    date: '2025-11-12 02:10 PM',
  },
];

export const AdminTransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<
    typeof mockTransactions[0] | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || txn.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Volume',
      value: '₦51,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      label: 'Transactions',
      value: mockTransactions.length,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Deposits',
      value: mockTransactions.filter((t) => t.type === 'deposit').length,
      change: '+15%',
      trend: 'up',
      icon: ArrowDownRight,
      color: 'blue',
    },
    {
      label: 'Withdrawals',
      value: mockTransactions.filter((t) => t.type === 'withdrawal').length,
      change: '-5%',
      trend: 'down',
      icon: ArrowUpRight,
      color: 'yellow',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
      processing: 'info',
    };
    return variants[status] || 'default';
  };

  const getTypeBadge = (type: string) => {
    return type === 'deposit' ? 'success' : 'info';
  };

  const handleViewTransaction = (transaction: typeof mockTransactions[0]) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleExportTransactions = () => {
    console.log('Exporting transactions data');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 pb-20 sm:pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Transactions
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Monitor all platform transactions
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExportTransactions}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by ID, user, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={Search}
                />
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'deposit', label: 'Deposits' },
                  { value: 'withdrawal', label: 'Withdrawals' },
                ]}
                className="sm:w-40"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
                className="sm:w-40"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>All Transactions</span>
              <Badge variant="info" size="sm">
                {filteredTransactions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Transaction ID</TableHeader>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader className="hidden lg:table-cell">Plan</TableHeader>
                    <TableHeader className="hidden md:table-cell">Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.user}
                          </p>
                          <p className="text-xs text-gray-600">
                            {transaction.userId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadge(transaction.type)} size="sm">
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            transaction.type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'deposit' ? '+' : '-'}₦
                          {transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {transaction.plan}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-600">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(transaction.status)} size="sm">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewTransaction(transaction)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No transactions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedTransaction.id}
                </h3>
                <p className="text-sm text-gray-600">{selectedTransaction.date}</p>
              </div>
              <Badge
                variant={getStatusBadge(selectedTransaction.status)}
                size="sm"
              >
                {selectedTransaction.status}
              </Badge>
            </div>

            {/* Transaction Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">User</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransaction.user}
                </p>
                <p className="text-xs text-gray-600">{selectedTransaction.userId}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Transaction Type</p>
                <Badge variant={getTypeBadge(selectedTransaction.type)} size="sm">
                  {selectedTransaction.type}
                </Badge>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  selectedTransaction.type === 'deposit'
                    ? 'bg-green-50'
                    : 'bg-red-50'
                }`}
              >
                <p
                  className={`text-xs mb-1 ${
                    selectedTransaction.type === 'deposit'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  Amount
                </p>
                <p
                  className={`text-lg font-bold ${
                    selectedTransaction.type === 'deposit'
                      ? 'text-green-900'
                      : 'text-red-900'
                  }`}
                >
                  {selectedTransaction.type === 'deposit' ? '+' : '-'}₦
                  {selectedTransaction.amount.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Savings Plan</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransaction.plan}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTransaction.paymentMethod}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Reference</p>
                <p className="text-xs font-mono font-medium text-gray-900">
                  {selectedTransaction.reference}
                </p>
              </div>
            </div>

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
