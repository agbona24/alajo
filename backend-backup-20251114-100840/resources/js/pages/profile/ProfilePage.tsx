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
  Modal,
  ModalFooter,
} from '../../components/common';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit2,
  Shield,
  Bell,
  CreditCard,
  Award,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock user data
const userData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+234 803 456 7890',
  address: '123 Savings Street, Lagos, Nigeria',
  dateOfBirth: '1990-05-15',
  memberSince: 'January 2025',
  accountTier: 'Gold',
  totalSaved: 78000,
  activeGoals: 3,
  completedGoals: 2,
};

const achievements = [
  {
    id: 1,
    title: 'First Deposit',
    description: 'Made your first savings deposit',
    icon: '🎉',
    earned: true,
    date: 'Jan 15, 2025',
  },
  {
    id: 2,
    title: '30-Day Streak',
    description: 'Saved consistently for 30 days',
    icon: '🔥',
    earned: true,
    date: 'Feb 20, 2025',
  },
  {
    id: 3,
    title: 'Goal Crusher',
    description: 'Completed your first savings goal',
    icon: '🎯',
    earned: true,
    date: 'Mar 10, 2025',
  },
  {
    id: 4,
    title: 'High Roller',
    description: 'Save ₦100,000 in total',
    icon: '💰',
    earned: false,
    date: null,
  },
  {
    id: 5,
    title: '90-Day Warrior',
    description: 'Save consistently for 90 days',
    icon: '⚔️',
    earned: false,
    date: null,
  },
];

export const ProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile updated:', data);
    setIsEditModalOpen(false);
  };

  const stats = [
    {
      label: 'Total Saved',
      value: `₦${userData.totalSaved.toLocaleString()}`,
      icon: CreditCard,
      color: 'primary',
    },
    {
      label: 'Active Goals',
      value: userData.activeGoals,
      icon: Award,
      color: 'green',
    },
    {
      label: 'Completed',
      value: userData.completedGoals,
      icon: Shield,
      color: 'blue',
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your account information
        </p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                  {userData.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary-600"
                >
                  <Camera className="h-5 w-5 text-primary-600" />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userData.fullName}
                  </h2>
                  <Badge variant="success" size="sm">
                    {userData.accountTier} Member
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center justify-center sm:justify-start space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {userData.memberSince}</span>
                  </p>
                </div>
                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stat.color === 'primary'
                          ? 'bg-primary-100'
                          : stat.color === 'green'
                          ? 'bg-green-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <stat.icon
                        className={`h-5 w-5 ${
                          stat.color === 'primary'
                            ? 'text-primary-600'
                            : stat.color === 'green'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.fullName}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Email Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.phone}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(userData.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                <p className="text-xs text-gray-600 mb-1">Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3
                      className={`text-sm font-bold mb-1 ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <Badge variant="success" size="sm">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Locked
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />

          <Input
            label="Address (Optional)"
            placeholder="Enter your address"
            error={errors.address?.message}
            {...register('address')}
          />

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Change Avatar Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Change Profile Picture"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {userData.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>Upload a new profile picture</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAvatarModalOpen(false)}>
              Upload
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </motion.div>
  );
};
