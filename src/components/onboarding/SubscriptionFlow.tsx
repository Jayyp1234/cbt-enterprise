import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, CreditCard, Calendar, Shield, Zap, Award, Users, Database, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface SubscriptionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  currentPlan?: SubscriptionPlan | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annually';
  features: string[];
  studentsLimit: number;
  staffLimit: number | 'unlimited';
  storageLimit: number;
  recommended?: boolean;
}

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe,
  currentPlan 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    // Reset selected plan when modal opens
    if (isOpen) {
      setSelectedPlan(null);
      setShowPaymentForm(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? 25000 : 240000,
      billingCycle,
      features: [
        'Up to 100 students',
        '5 staff accounts',
        'Basic analytics',
        'Standard support',
        'Basic branding',
        '10GB storage',
        'Study Materials',
        'Results & Analytics'
      ],
      studentsLimit: 100,
      staffLimit: 5,
      storageLimit: 10
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 45000 : 432000,
      billingCycle,
      features: [
        'Up to 250 students',
        '15 staff accounts',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        '25GB storage',
        'Study Materials',
        'Results & Analytics',
        'Mock Examinations',
        'Academic Dictionary',
        'Smart Fee Collection'
      ],
      studentsLimit: 250,
      staffLimit: 15,
      storageLimit: 25
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pro',
      price: billingCycle === 'monthly' ? 85000 : 816000,
      billingCycle,
      features: [
        'Up to 500 students',
        'Unlimited staff accounts',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'Data export',
        '50GB storage',
        'AI-Powered Tutor Assistant',
        'Staff Management & Payroll',
        'Performance Feedback Reports',
        'Bulk Messaging System',
        'All Core Learning Features'
      ],
      studentsLimit: 500,
      staffLimit: 'unlimited',
      storageLimit: 50,
      recommended: true
    },
    {
      id: 'enterprise-plus',
      name: 'Enterprise Plus',
      price: billingCycle === 'monthly' ? 150000 : 1440000,
      billingCycle,
      features: [
        'Up to 1000 students',
        'Unlimited staff accounts',
        'Advanced analytics',
        'Dedicated support',
        'Custom branding',
        'API access',
        'Data export',
        '100GB storage',
        'White labeling',
        'Custom integrations',
        'Points & Wallet System',
        'Parent Portal Access',
        'Complete White Labeling',
        'Custom Domain',
        'All Premium Features'
      ],
      studentsLimit: 1000,
      staffLimit: 'unlimited',
      storageLimit: 100
    }
  ];

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan({
      ...plan,
      billingCycle
    });
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      setError('Please select a subscription plan to continue.');
      return;
    }
    
    setError(null);
    setShowPaymentForm(true);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!paymentData.cardNumber || !paymentData.cardholderName || 
        !paymentData.expiryMonth || !paymentData.expiryYear || !paymentData.cvv) {
      setError('Please fill in all payment details.');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedPlan) {
        onSubscribe(selectedPlan);
      }
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getDiscountPercentage = () => {
    return '15%';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {currentPlan ? 'Manage Subscription' : 'Choose Your Subscription Plan'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            {currentPlan 
              ? 'Review your current plan or upgrade to access more features' 
              : 'Select the plan that best fits your institution\'s needs'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {currentPlan && !showPaymentForm && (
            <div className="mb-6 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-indigo-800">Current Plan: {currentPlan.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-indigo-700 mt-1">
                    {currentPlan.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} billing • 
                    Next payment on February 15, 2024
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-indigo-700">
                      <Users className="w-4 h-4" />
                      <span>{currentPlan.studentsLimit} students</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-indigo-700">
                      <Database className="w-4 h-4" />
                      <span>{currentPlan.storageLimit}GB storage</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-800">
                    {formatPrice(currentPlan.price)}
                  </div>
                  <p className="text-indigo-700">
                    per {currentPlan.billingCycle === 'monthly' ? 'month' : 'year'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!showPaymentForm ? (
            <>
              {/* Billing Cycle Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annually')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      billingCycle === 'annually'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Annually
                    <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Save {getDiscountPercentage()}
                    </span>
                  </button>
                </div>
              </div>

              {/* Subscription Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border rounded-xl p-6 relative transition-all ${
                      selectedPlan?.id === plan.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : plan.recommended 
                          ? 'border-indigo-300 bg-indigo-50/30' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                        <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                      <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={selectedPlan?.id === plan.id ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handleSelectPlan({...plan, billingCycle})}
                    >
                      {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Feature Comparison */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Feature Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feature
                        </th>
                        {plans.map((plan) => (
                          <th key={plan.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Students Limit
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {plan.studentsLimit}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Staff Accounts
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {typeof plan.staffLimit === 'number' ? plan.staffLimit : 'Unlimited'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Storage
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {plan.storageLimit}GB
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Custom Branding
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                            {plan.id === 'basic' ? (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          API Access
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                            {plan.id === 'basic' || plan.id === 'professional' ? (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          White Labeling
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                            {plan.id === 'enterprise-plus' ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleContinue} 
                  disabled={!selectedPlan}
                  className={!selectedPlan ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Information</h3>
              
              {selectedPlan && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-indigo-800">{selectedPlan.name} Plan</h4>
                      <p className="text-sm text-indigo-700">
                        {selectedPlan.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-800">{formatPrice(selectedPlan.price)}</div>
                      <p className="text-sm text-indigo-700">
                        per {selectedPlan.billingCycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    id="cardholderName"
                    name="cardholderName"
                    type="text"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      value={paymentData.expiryMonth}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">YY</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year.toString().slice(-2)}>
                          {year.toString().slice(-2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start mt-6">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Your payment information is secure. We use industry-standard encryption to protect your data.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPaymentForm(false)}
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Complete Subscription'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionFlow;