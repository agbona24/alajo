import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  EmptyState,
  Modal,
  ModalFooter,
  Input,
  Select,
} from '../../components/common';
import {
  PiggyBank,
  Plus,
  TrendingUp,
  Calendar,
  Target,
  Pause,
  Play,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createPlanSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters'),
  type: z.enum(['daily', 'weekly', 'monthly', 'goal_based']),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 300;
    }, 'Minimum contribution is ₦300'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  targetAmount: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  autoDebit: z.boolean().default(false),
});

type CreatePlanFormData = z.infer<typeof createPlanSchema>;

// Sample data
const savingsPlans = [
  {
    id: '1',
    name: 'Emergency Fund',
    type: 'goal_based',
    currentBalance: 38000,
    targetAmount: 100000,
    amountPerCycle: 2000,
    frequency: 'daily',
    status: 'active',
    progress: 38,
    nextDebit: '2025-11-14',
  },
  {
    id: '2',
    name: 'Vacation Savings',
    type: 'monthly',
    currentBalance: 25000,
    targetAmount: 50000,
    amountPerCycle: 5000,
    frequency: 'monthly',
    status: 'active',
    progress: 50,
    nextDebit: '2025-12-01',
  },
  {
    id: '3',
    name: 'New Laptop',
    type: 'weekly',
    currentBalance: 15000,
    targetAmount: 200000,
    amountPerCycle: 3000,
    frequency: 'weekly',
    status: 'paused',
    progress: 7.5,
    nextDebit: null,
  },
];

export const SavingsPlansPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
  });

  const planType = watch('type');

  const onSubmit = (data: CreatePlanFormData) => {
    console.log('Create plan:', data);
    setIsCreateModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      active: 'success',
      paused: 'warning',
      completed: 'info',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Savings Plans
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your savings goals
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 shadow-lg"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Plan</span>
          </Button>
        </motion.div>
      </div>

      {/* Plans Grid */}
      {savingsPlans.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {savingsPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      <Badge
                        variant={getStatusBadge(plan.status)}
                        size="sm"
                        className="mt-1 capitalize"
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Balance */}
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Current Balance
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ₦{plan.currentBalance.toLocaleString()}
                    </p>
                    {plan.targetAmount && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        of ₦{plan.targetAmount.toLocaleString()} goal
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {plan.targetAmount && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-medium text-primary-600">
                          {plan.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${plan.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-primary-600 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Amount per cycle</span>
                      <span className="font-medium text-gray-900">
                        ₦{plan.amountPerCycle.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Frequency</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {plan.frequency}
                      </span>
                    </div>
                    {plan.nextDebit && (
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Next debit</span>
                        <span className="font-medium text-gray-900">
                          {new Date(plan.nextDebit).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                    {plan.status === 'active' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </motion.button>
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
              icon={PiggyBank}
              title="No savings plans yet"
              description="Create your first savings plan to start building wealth"
              actionLabel="Create Plan"
              onAction={() => setIsCreateModalOpen(true)}
            />
          </CardContent>
        </Card>
      )}

      {/* Create Plan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Savings Plan"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Plan Name"
            placeholder="e.g., Emergency Fund, Vacation"
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label="Plan Type"
            options={[
              { value: 'daily', label: 'Daily Savings' },
              { value: 'weekly', label: 'Weekly Savings' },
              { value: 'monthly', label: 'Monthly Savings' },
              { value: 'goal_based', label: 'Goal-Based Savings' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />

          <Input
            label="Amount Per Cycle"
            type="number"
            placeholder="Enter amount (minimum ₦300)"
            helperText="Minimum contribution is ₦300"
            error={errors.amount?.message}
            {...register('amount')}
          />

          <Select
            label="Frequency"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            error={errors.frequency?.message}
            {...register('frequency')}
          />

          {planType === 'goal_based' && (
            <Input
              label="Target Amount (Optional)"
              type="number"
              placeholder="Enter target amount"
              helperText="What's your savings goal?"
              error={errors.targetAmount?.message}
              {...register('targetAmount')}
            />
          )}

          <Input
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoDebit"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              {...register('autoDebit')}
            />
            <label
              htmlFor="autoDebit"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Enable automatic debit
            </label>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Plan</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};
