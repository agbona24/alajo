import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardContent } from '../common';
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
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    title: 'Welcome to Alajo!',
    subtitle: '"Savings Saves Life"',
    description:
      'Thank you for joining Alajo Savings. Before you start, please take a moment to understand our saving account regulations.',
    icon: Shield,
    color: 'primary',
  },
  {
    id: 2,
    title: 'Important Regulations',
    regulations: [
      {
        icon: Shield,
        title: 'Minimum Contribution',
        text: 'Minimum daily contribution is ₦300',
        color: 'primary',
      },
      {
        icon: Clock,
        title: 'Working Days',
        text: 'Monday to Saturday only',
        color: 'blue',
      },
      {
        icon: Calendar,
        title: 'Monthly Deadline',
        text: 'Transactions end on last day of month',
        color: 'yellow',
      },
    ],
  },
  {
    id: 3,
    title: 'Security & Verification',
    regulations: [
      {
        icon: AlertCircle,
        title: 'Report Lost Cards',
        text: 'Report lost passbook immediately',
        color: 'red',
      },
      {
        icon: UserCheck,
        title: 'Verify Transactions',
        text: 'Always verify your passbook after payment',
        color: 'green',
      },
      {
        icon: Ban,
        title: 'No Tampering',
        text: 'Do not alter any passbook entries',
        color: 'red',
      },
    ],
  },
  {
    id: 4,
    title: 'Fees & Charges',
    regulations: [
      {
        icon: CreditCard,
        title: 'Card Replacement',
        text: 'Lost card replacement: ₦200',
        color: 'orange',
      },
      {
        icon: FileText,
        title: 'Administrative Charge',
        text: "One day's contribution may be deducted monthly",
        color: 'yellow',
      },
      {
        icon: CheckCircle,
        title: 'Return for Verification',
        text: 'Return card after collecting money',
        color: 'green',
      },
    ],
  },
  {
    id: 5,
    title: 'Ready to Save!',
    description:
      'By continuing, you agree to abide by these regulations. If you have any questions, our support team is always here to help.',
    contact: {
      whatsapp: '08035816788',
      phone: '09088435750',
      hours: 'Monday - Saturday',
    },
    icon: CheckCircle,
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

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (agreedToTerms) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Welcome Step */}
                {currentStepData.id === 1 && (
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${getIconColor(
                        currentStepData.color!
                      )}`}
                    >
                      <currentStepData.icon className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {currentStepData.title}
                    </h2>
                    <p className="text-lg text-primary-600 font-semibold mb-4">
                      {currentStepData.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {currentStepData.description}
                    </p>
                  </div>
                )}

                {/* Regulation Steps */}
                {currentStepData.regulations && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      {currentStepData.title}
                    </h2>
                    <div className="space-y-4">
                      {currentStepData.regulations.map((reg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(
                              reg.color
                            )}`}
                          >
                            <reg.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {reg.title}
                            </h3>
                            <p className="text-sm text-gray-600">{reg.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Step */}
                {currentStepData.id === 5 && (
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${getIconColor(
                        currentStepData.color!
                      )}`}
                    >
                      <currentStepData.icon className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      {currentStepData.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {currentStepData.description}
                    </p>

                    {/* Contact Info */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-primary-900 mb-3">
                        Customer Support
                      </h3>
                      <div className="space-y-2 text-sm text-primary-800">
                        <p>
                          <span className="font-semibold">WhatsApp:</span>{' '}
                          {currentStepData.contact?.whatsapp}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{' '}
                          {currentStepData.contact?.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Hours:</span>{' '}
                          {currentStepData.contact?.hours}
                        </p>
                      </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 text-left">
                        I have read and agree to abide by all the saving account
                        regulations and terms of service.
                      </span>
                    </label>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-primary-600'
                        : index < currentStep
                        ? 'bg-primary-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={isLastStep && !agreedToTerms}
                className="flex items-center space-x-2"
              >
                <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                {isLastStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
