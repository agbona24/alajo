import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Ban,
  UserCheck,
} from 'lucide-react';

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

const regulations = [
  {
    id: 1,
    icon: AlertCircle,
    title: 'Report Lost Passbook Immediately',
    description: 'If your passbook is lost or stolen, report it to us immediately to prevent unauthorized transactions.',
    color: 'red',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'One Day Deduction Policy',
    description: "One day's contribution may be deducted from a month's total as administrative charge.",
    color: 'yellow',
  },
  {
    id: 3,
    icon: CreditCard,
    title: 'Card Replacement Fee',
    description: 'Lost card replacement costs ₦200. Please keep your card safe.',
    color: 'orange',
  },
  {
    id: 4,
    icon: Clock,
    title: 'Working Days',
    description: 'We operate Monday to Saturday. No transactions on Sundays and public holidays.',
    color: 'blue',
  },
  {
    id: 5,
    icon: Ban,
    title: 'Monthly Transaction Deadline',
    description: "Month's transaction ends on the last day. No carryover of uncompleted contributions to next month.",
    color: 'red',
  },
  {
    id: 6,
    icon: UserCheck,
    title: 'Verify Your Passbook',
    description: 'Always verify your passbook entries after making payment to ensure accuracy.',
    color: 'green',
  },
  {
    id: 7,
    icon: Shield,
    title: 'Minimum Contribution',
    description: 'Minimum daily contribution is ₦300. Please ensure you meet this requirement.',
    color: 'primary',
  },
  {
    id: 8,
    icon: FileText,
    title: 'Do Not Tamper',
    description: 'Do not tamper with any entry in your passbook. All alterations must be done by authorized personnel.',
    color: 'red',
  },
  {
    id: 9,
    icon: CheckCircle,
    title: 'Return Card for Verification',
    description: 'After collecting your money, return the card for verification and record keeping.',
    color: 'green',
  },
];

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    orange: 'text-orange-600 bg-orange-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    primary: 'text-primary-600 bg-primary-100',
  };
  return colors[color] || 'text-gray-600 bg-gray-100';
};

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms & Regulations
          </h1>
          <p className="text-gray-600 text-lg">
            Saving Account Regulations
          </p>
          <p className="text-sm text-primary-600 font-semibold mt-2">
            "Savings Saves Life"
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Alajo Savings! To ensure smooth operations and protect your savings,
                please read and understand the following regulations. By using our services, you
                agree to abide by these terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regulations Grid */}
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          {regulations.map((regulation, index) => (
            <motion.div
              key={regulation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(
                        regulation.color
                      )}`}
                    >
                      <regulation.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {regulation.id}. {regulation.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {regulation.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Important Notice */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">
                    Important Notice
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    Violation of any of these regulations may result in penalties or suspension
                    of your account. If you have any questions or need clarification, please
                    contact our customer service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="text-primary-100 mb-4">
                Our customer service team is here to assist you
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">WhatsApp:</span> 08035816788
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> 09088435750
                </p>
                <p>
                  <span className="font-semibold">Working Hours:</span> Monday - Saturday
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
