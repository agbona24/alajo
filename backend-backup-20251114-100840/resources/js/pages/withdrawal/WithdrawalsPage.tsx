import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select,
  EmptyState,
} from '../../components/common';
import {
  ArrowDownRight,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const withdrawalSchema = z.object({
  planId: z.string().min(1, 'Please select a savings plan'),
  amount: z.string().min(1, 'Amount is required'),
  type: z.enum(['instant', 'scheduled']),
  reason: z.string().optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

const withdrawals = [
  {
    id: 'WD001',
    plan: 'Emergency Fund',
    amount: 10000,
    fee: 200,
    netAmount: 9800,
    type: 'instant',
    status: 'completed',
    date: '2025-11-10',
  },
  {
    id: 'WD002',
    plan: 'Vacation Savings',
    amount: 5000,
    fee: 0,
    netAmount: 5000,
    type: 'scheduled',
    status: 'processing',
    date: '2025-11-08',
  },
];

export const WithdrawalsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  const withdrawalType = watch('type');

  const onSubmit = (data: WithdrawalFormData) => {
    console.log('Withdrawal request:', data);
    setIsModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Withdrawals
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Request and track your withdrawals
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 shadow-lg"
          >
            <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Withdraw</span>
          </Button>
        </motion.div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Withdrawal Fees
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Instant withdrawals: 2% fee • Scheduled withdrawals: Free
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals List */}
      {withdrawals.length > 0 ? (
        <div className="space-y-3">
          {withdrawals.map((withdrawal, index) => (
            <motion.div
              key={withdrawal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {withdrawal.plan}
                        </p>
                        <p className="text-xs text-gray-600">
                          {withdrawal.id} • {withdrawal.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusBadge(withdrawal.status)}
                      size="sm"
                      className="capitalize flex items-center space-x-1"
                    >
                      {getStatusIcon(withdrawal.status)}
                      <span>{withdrawal.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Amount</p>
                      <p className="font-semibold text-gray-900">
                        ₦{withdrawal.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Fee</p>
                      <p className="font-semibold text-red-600">
                        ₦{withdrawal.fee.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Net Amount</p>
                      <p className="text-lg font-bold text-green-600">
                        ₦{withdrawal.netAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-600 capitalize">
                      {withdrawal.type} withdrawal
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={ArrowDownRight}
              title="No withdrawals yet"
              description="You haven't made any withdrawal requests"
              actionLabel="Request Withdrawal"
              onAction={() => setIsModalOpen(true)}
            />
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Withdrawal"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Select Savings Plan"
            options={[
              { value: '', label: 'Choose a plan' },
              { value: '1', label: 'Emergency Fund (₦38,000)' },
              { value: '2', label: 'Vacation Savings (₦25,000)' },
              { value: '3', label: 'New Laptop (₦15,000)' },
            ]}
            error={errors.planId?.message}
            {...register('planId')}
          />

          <Input
            label="Withdrawal Amount"
            type="number"
            placeholder="Enter amount"
            helperText="Available balance will be shown based on selected plan"
            error={errors.amount?.message}
            {...register('amount')}
          />

          <Select
            label="Withdrawal Type"
            options={[
              { value: 'instant', label: 'Instant (2% fee)' },
              { value: 'scheduled', label: 'Scheduled (Free)' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />

          {withdrawalType === 'instant' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Fee Notice:</strong> Instant withdrawals incur a 2% processing fee
              </p>
            </div>
          )}

          <Input
            label="Reason (Optional)"
            placeholder="e.g., Emergency expense"
            error={errors.reason?.message}
            {...register('reason')}
          />

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Request Withdrawal</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};
