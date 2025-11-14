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
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Wallet,
  Users,
  TrendingUp,
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

// Mock withdrawal data
const mockWithdrawals = [
  {
    id: 'WD001',
    user: 'John Doe',
    userId: 'USR001',
    amount: 50000,
    fee: 1000,
    netAmount: 49000,
    plan: 'Emergency Fund',
    accountName: 'John Doe',
    accountNumber: '0123456789',
    bankName: 'GTBank',
    type: 'instant',
    status: 'pending',
    requestedDate: '2025-11-13 10:30 AM',
    reason: 'Medical emergency',
  },
  {
    id: 'WD002',
    user: 'Sarah Williams',
    userId: 'USR004',
    amount: 25000,
    fee: 0,
    netAmount: 25000,
    plan: 'Vacation',
    accountName: 'Sarah Williams',
    accountNumber: '9876543210',
    bankName: 'Access Bank',
    type: 'scheduled',
    status: 'pending',
    requestedDate: '2025-11-12 04:20 PM',
    reason: 'Planned withdrawal',
  },
  {
    id: 'WD003',
    user: 'Mike Johnson',
    userId: 'USR003',
    amount: 15000,
    fee: 300,
    netAmount: 14700,
    plan: 'New Laptop',
    accountName: 'Mike Johnson',
    accountNumber: '1111222233',
    bankName: 'Zenith Bank',
    type: 'instant',
    status: 'approved',
    requestedDate: '2025-11-12 02:10 PM',
    approvedDate: '2025-11-12 02:30 PM',
    reason: 'Purchase laptop',
  },
  {
    id: 'WD004',
    user: 'David Brown',
    userId: 'USR005',
    amount: 8000,
    fee: 160,
    netAmount: 7840,
    plan: 'Emergency Fund',
    accountName: 'David Brown',
    accountNumber: '4444555566',
    bankName: 'First Bank',
    type: 'instant',
    status: 'rejected',
    requestedDate: '2025-11-11 11:00 AM',
    rejectedDate: '2025-11-11 12:00 PM',
    rejectionReason: 'Insufficient balance',
    reason: 'Emergency',
  },
  {
    id: 'WD005',
    user: 'Jane Smith',
    userId: 'USR002',
    amount: 100000,
    fee: 0,
    netAmount: 100000,
    plan: 'House Savings',
    accountName: 'Jane Smith',
    accountNumber: '7777888899',
    bankName: 'UBA',
    type: 'scheduled',
    status: 'completed',
    requestedDate: '2025-11-10 09:00 AM',
    approvedDate: '2025-11-10 09:15 AM',
    completedDate: '2025-11-10 10:00 AM',
    reason: 'Goal achieved',
  },
];

export const AdminWithdrawalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<
    typeof mockWithdrawals[0] | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredWithdrawals = mockWithdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.userId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || withdrawal.status === statusFilter;
    const matchesType = typeFilter === 'all' || withdrawal.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingWithdrawals = mockWithdrawals.filter(
    (w) => w.status === 'pending'
  ).length;
  const totalAmount = mockWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const approvedCount = mockWithdrawals.filter(
    (w) => w.status === 'approved' || w.status === 'completed'
  ).length;

  const stats = [
    {
      label: 'Pending',
      value: pendingWithdrawals,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Total Amount',
      value: `₦${(totalAmount / 1000).toFixed(0)}k`,
      icon: Wallet,
      color: 'primary',
    },
    {
      label: 'Approved',
      value: approvedCount,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Total Requests',
      value: mockWithdrawals.length,
      icon: TrendingUp,
      color: 'blue',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      pending: 'warning',
      approved: 'info',
      completed: 'success',
      rejected: 'danger',
    };
    return variants[status] || 'default';
  };

  const handleViewWithdrawal = (withdrawal: typeof mockWithdrawals[0]) => {
    setSelectedWithdrawal(withdrawal);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (withdrawal: typeof mockWithdrawals[0]) => {
    setSelectedWithdrawal(withdrawal);
    setIsApproveModalOpen(true);
  };

  const handleReject = (withdrawal: typeof mockWithdrawals[0]) => {
    setSelectedWithdrawal(withdrawal);
    setIsRejectModalOpen(true);
  };

  const confirmApproval = () => {
    console.log('Approving withdrawal:', selectedWithdrawal?.id);
    setIsApproveModalOpen(false);
    setSelectedWithdrawal(null);
  };

  const confirmRejection = () => {
    console.log('Rejecting withdrawal:', selectedWithdrawal?.id, 'Reason:', rejectionReason);
    setIsRejectModalOpen(false);
    setSelectedWithdrawal(null);
    setRejectionReason('');
  };

  const handleExport = () => {
    console.log('Exporting withdrawals data');
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
              Withdrawals
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage withdrawal requests and approvals
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExport}
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
                  placeholder="Search by ID, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={Search}
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
                className="sm:w-40"
              />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'instant', label: 'Instant' },
                  { value: 'scheduled', label: 'Scheduled' },
                ]}
                className="sm:w-40"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdrawals Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Withdrawal Requests</span>
              <Badge variant="info" size="sm">
                {filteredWithdrawals.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader className="hidden lg:table-cell">Type</TableHeader>
                    <TableHeader className="hidden md:table-cell">Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal, index) => (
                    <motion.tr
                      key={withdrawal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">
                        {withdrawal.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {withdrawal.user}
                          </p>
                          <p className="text-xs text-gray-600">
                            {withdrawal.userId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-red-600">
                            ₦{withdrawal.amount.toLocaleString()}
                          </p>
                          {withdrawal.fee > 0 && (
                            <p className="text-xs text-gray-600">
                              Fee: ₦{withdrawal.fee.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge
                          variant={withdrawal.type === 'instant' ? 'warning' : 'info'}
                          size="sm"
                        >
                          {withdrawal.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-600">
                        {withdrawal.requestedDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(withdrawal.status)} size="sm">
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewWithdrawal(withdrawal)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          {withdrawal.status === 'pending' && (
                            <>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleApprove(withdrawal)}
                                  title="Approve"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleReject(withdrawal)}
                                  title="Reject"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredWithdrawals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No withdrawal requests found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdrawal Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Withdrawal Details"
        size="lg"
      >
        {selectedWithdrawal && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedWithdrawal.id}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedWithdrawal.requestedDate}
                </p>
              </div>
              <Badge variant={getStatusBadge(selectedWithdrawal.status)} size="sm">
                {selectedWithdrawal.status}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">User</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedWithdrawal.user}
                </p>
                <p className="text-xs text-gray-600">{selectedWithdrawal.userId}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Savings Plan</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedWithdrawal.plan}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">Withdrawal Amount</p>
                <p className="text-lg font-bold text-red-900">
                  ₦{selectedWithdrawal.amount.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-600 mb-1">Fee</p>
                <p className="text-lg font-bold text-yellow-900">
                  ₦{selectedWithdrawal.fee.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg sm:col-span-2">
                <p className="text-xs text-green-600 mb-1">Net Amount</p>
                <p className="text-xl font-bold text-green-900">
                  ₦{selectedWithdrawal.netAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Account Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedWithdrawal.accountName}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Bank</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedWithdrawal.bankName}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                <p className="text-xs text-gray-600 mb-1">Account Number</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  {selectedWithdrawal.accountNumber}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                <p className="text-xs text-gray-600 mb-1">Reason</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedWithdrawal.reason}
                </p>
              </div>

              {selectedWithdrawal.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-lg sm:col-span-2">
                  <p className="text-xs text-red-600 mb-1">Rejection Reason</p>
                  <p className="text-sm font-medium text-red-900">
                    {selectedWithdrawal.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedWithdrawal.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleReject(selectedWithdrawal);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleApprove(selectedWithdrawal);
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Withdrawal"
        size="md"
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900 mb-2">
                Are you sure you want to approve this withdrawal?
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">User:</span>{' '}
                  {selectedWithdrawal.user}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₦
                  {selectedWithdrawal.netAmount.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Bank:</span>{' '}
                  {selectedWithdrawal.bankName} - {selectedWithdrawal.accountNumber}
                </p>
              </div>
            </div>

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsApproveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmApproval}>Confirm Approval</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Withdrawal"
        size="md"
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900 mb-2">
                Are you sure you want to reject this withdrawal?
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">User:</span>{' '}
                  {selectedWithdrawal.user}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₦
                  {selectedWithdrawal.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <Input
              label="Rejection Reason (Required)"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsRejectModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
