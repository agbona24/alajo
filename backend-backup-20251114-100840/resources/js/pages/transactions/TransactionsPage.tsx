import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Input,
  Select,
} from '../../components/common';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const transactions = [
  {
    id: 'TXN001',
    type: 'deposit',
    amount: 5000,
    plan: 'Emergency Fund',
    method: 'card',
    status: 'completed',
    date: '2025-11-13 10:30',
  },
  {
    id: 'TXN002',
    type: 'deposit',
    amount: 3000,
    plan: 'Vacation Savings',
    method: 'bank_transfer',
    status: 'completed',
    date: '2025-11-12 14:15',
  },
  {
    id: 'TXN003',
    type: 'withdrawal',
    amount: 10000,
    plan: 'Emergency Fund',
    method: 'bank_transfer',
    status: 'processing',
    date: '2025-11-11 09:00',
  },
  {
    id: 'TXN004',
    type: 'deposit',
    amount: 2000,
    plan: 'New Laptop',
    method: 'auto_debit',
    status: 'completed',
    date: '2025-11-10 06:00',
  },
  {
    id: 'TXN005',
    type: 'deposit',
    amount: 5000,
    plan: 'Vacation Savings',
    method: 'card',
    status: 'failed',
    date: '2025-11-09 18:45',
  },
];

export const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'success',
      processing: 'warning',
      failed: 'danger',
      pending: 'info',
    } as const;
    return variants[status as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Transactions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          View and manage your transaction history
        </p>
      </div>

      {/* Filters - Mobile Optimized */}
      <Card>
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'deposit', label: 'Deposits' },
                { value: 'withdrawal', label: 'Withdrawals' },
              ]}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'processing', label: 'Processing' },
                { value: 'failed', label: 'Failed' },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Plan</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Method</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {txn.type === 'deposit' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{txn.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{txn.plan}</TableCell>
                  <TableCell
                    className={`font-semibold ${
                      txn.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'deposit' ? '+' : '-'}₦
                    {txn.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {txn.method.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadge(txn.status)}
                      size="sm"
                      className="capitalize"
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{txn.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile List View */}
      <div className="md:hidden space-y-3">
        {transactions.map((txn, index) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'deposit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {txn.type === 'deposit' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{txn.plan}</p>
                      <p className="text-xs text-gray-600">{txn.id}</p>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusBadge(txn.status)}
                    size="sm"
                    className="capitalize"
                  >
                    {txn.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1 capitalize">
                      {txn.method.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-600">{txn.date}</p>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      txn.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'deposit' ? '+' : '-'}₦
                    {txn.amount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
