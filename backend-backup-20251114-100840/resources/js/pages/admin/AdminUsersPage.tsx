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
  Modal,
  ModalFooter,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '../../components/common';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Wallet,
  TrendingUp,
  Download,
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

// Mock user data
const mockUsers = [
  {
    id: 'USR001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 803 456 7890',
    joined: '2025-01-15',
    status: 'active',
    totalSavings: 78000,
    activePlans: 3,
    lastActive: '2 hours ago',
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+234 805 123 4567',
    joined: '2025-02-20',
    status: 'active',
    totalSavings: 125000,
    activePlans: 5,
    lastActive: '1 day ago',
  },
  {
    id: 'USR003',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+234 807 890 1234',
    joined: '2025-03-10',
    status: 'inactive',
    totalSavings: 45000,
    activePlans: 2,
    lastActive: '2 weeks ago',
  },
  {
    id: 'USR004',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+234 809 567 8901',
    joined: '2025-04-05',
    status: 'active',
    totalSavings: 250000,
    activePlans: 8,
    lastActive: '30 minutes ago',
  },
  {
    id: 'USR005',
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+234 811 234 5678',
    joined: '2025-05-15',
    status: 'suspended',
    totalSavings: 15000,
    activePlans: 1,
    lastActive: '1 month ago',
  },
];

export const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      active: 'success',
      inactive: 'info',
      suspended: 'danger',
      pending: 'warning',
    };
    return variants[status] || 'default';
  };

  const handleViewUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSuspendUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    console.log('Suspending user:', selectedUser?.id);
    setIsSuspendModalOpen(false);
    setSelectedUser(null);
  };

  const handleExportUsers = () => {
    console.log('Exporting users data');
  };

  const stats = [
    {
      label: 'Total Users',
      value: mockUsers.length,
      change: '+12%',
      color: 'primary',
    },
    {
      label: 'Active Users',
      value: mockUsers.filter((u) => u.status === 'active').length,
      change: '+8%',
      color: 'green',
    },
    {
      label: 'Suspended',
      value: mockUsers.filter((u) => u.status === 'suspended').length,
      change: '-2%',
      color: 'red',
    },
  ];

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
              User Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage and monitor all platform users
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExportUsers}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p
                    className={`text-xs ${
                      stat.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-red-600'
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
                  placeholder="Search by name, email, or ID..."
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
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'pending', label: 'Pending' },
                ]}
                className="sm:w-48"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>All Users</span>
              <Badge variant="info" size="sm">
                {filteredUsers.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>User ID</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader className="hidden md:table-cell">Email</TableHeader>
                    <TableHeader className="hidden lg:table-cell">
                      Total Savings
                    </TableHeader>
                    <TableHeader className="hidden sm:table-cell">
                      Active Plans
                    </TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600 md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-semibold text-green-600">
                        ₦{user.totalSavings.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <Badge variant="info" size="sm">
                          {user.activePlans}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(user.status)} size="sm">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewUser(user)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          {user.status !== 'suspended' && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSuspendUser(user)}
                                title="Suspend User"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-600">{selectedUser.id}</p>
                <Badge variant={getStatusBadge(selectedUser.status)} size="sm">
                  {selectedUser.status}
                </Badge>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Email</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.email}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Phone</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Joined</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedUser.joined).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Last Active</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.lastActive}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-600">Total Savings</p>
                </div>
                <p className="text-lg font-bold text-green-900">
                  ₦{selectedUser.totalSavings.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-600">Active Plans</p>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {selectedUser.activePlans} plans
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
              <Button onClick={() => handleEditUser(selectedUser)}>
                Edit User
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <Input label="Full Name" defaultValue={selectedUser.name} />
            <Input
              label="Email"
              type="email"
              defaultValue={selectedUser.email}
            />
            <Input label="Phone" type="tel" defaultValue={selectedUser.phone} />
            <Select
              label="Status"
              value={selectedUser.status}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>
                Save Changes
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Suspend User Modal */}
      <Modal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        title="Suspend User"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                Are you sure you want to suspend <strong>{selectedUser.name}</strong>?
                This will prevent them from accessing their account.
              </p>
            </div>
            <Input label="Reason for Suspension" placeholder="Enter reason..." />
            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsSuspendModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmSuspend}>
                Suspend User
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
