import React, { useState } from 'react';
import { 
  CreditCard, Calendar, DollarSign, Clock, 
  Download, FileText, Plus, ChevronDown, 
  CheckCircle, AlertTriangle, TrendingUp, 
  BarChart3, Wallet, Users, Settings, 
  ArrowUpRight, ArrowDownRight, Zap, Shield
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';

// Define a custom hook for billing data
const useBillingData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  // Simulate API call
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockData = {
          subscription: {
            plan: 'Enterprise Pro',
            status: 'Active',
            billingCycle: 'Monthly',
            nextBillingDate: 'February 15, 2024',
            amount: 85000, // in Naira
            features: [
              'Up to 500 students',
              'Unlimited staff accounts',
              'Advanced analytics',
              'Priority support',
              'Custom branding',
              'API access',
              'Data export',
              '50GB storage'
            ]
          },
          paymentMethods: [
            {
              id: 1,
              type: 'card',
              last4: '4242',
              expiryMonth: 12,
              expiryYear: 2025,
              brand: 'Visa',
              isDefault: true
            },
            {
              id: 2,
              type: 'card',
              last4: '5555',
              expiryMonth: 8,
              expiryYear: 2024,
              brand: 'Mastercard',
              isDefault: false
            }
          ],
          invoices: [
            {
              id: 'INV-2024-001',
              date: '2024-01-15',
              amount: 85000,
              status: 'Paid',
              description: 'Enterprise Pro Plan - January 2024',
              items: [
                { description: 'Enterprise Pro Plan (Monthly)', amount: 85000 }
              ],
              paymentMethod: 'Visa ending in 4242'
            },
            {
              id: 'INV-2023-012',
              date: '2023-12-15',
              amount: 85000,
              status: 'Paid',
              description: 'Enterprise Pro Plan - December 2023',
              items: [
                { description: 'Enterprise Pro Plan (Monthly)', amount: 85000 }
              ],
              paymentMethod: 'Visa ending in 4242'
            },
            {
              id: 'INV-2023-011',
              date: '2023-11-15',
              amount: 85000,
              status: 'Paid',
              description: 'Enterprise Pro Plan - November 2023',
              items: [
                { description: 'Enterprise Pro Plan (Monthly)', amount: 85000 }
              ],
              paymentMethod: 'Visa ending in 4242'
            }
          ],
          usageData: {
            students: {
              current: 342,
              limit: 500,
              percentage: 68.4
            },
            storage: {
              current: 12.4,
              limit: 50,
              percentage: 24.8,
              unit: 'GB'
            },
            apiCalls: {
              current: 15420,
              limit: 50000,
              percentage: 30.8
            }
          },
          billingHistory: [
            {
              id: 1,
              type: 'charge',
              description: 'Monthly subscription - Enterprise Pro',
              amount: 85000,
              date: '2024-01-15',
              status: 'Successful'
            },
            {
              id: 2,
              type: 'charge',
              description: 'Monthly subscription - Enterprise Pro',
              amount: 85000,
              date: '2023-12-15',
              status: 'Successful'
            },
            {
              id: 3,
              type: 'refund',
              description: 'Partial refund - Service outage credit',
              amount: -5000,
              date: '2023-12-10',
              status: 'Processed'
            }
          ],
          availablePlans: [
            {
              name: 'Basic',
              price: 25000,
              features: [
                'Up to 100 students',
                '5 staff accounts',
                'Basic analytics',
                'Standard support',
                'Basic branding',
                '10GB storage'
              ],
              recommended: false
            },
            {
              name: 'Professional',
              price: 45000,
              features: [
                'Up to 250 students',
                '15 staff accounts',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                '25GB storage'
              ],
              recommended: false
            },
            {
              name: 'Enterprise Pro',
              price: 85000,
              features: [
                'Up to 500 students',
                'Unlimited staff accounts',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'API access',
                'Data export',
                '50GB storage'
              ],
              recommended: true
            },
            {
              name: 'Enterprise Plus',
              price: 150000,
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
                'Custom integrations'
              ],
              recommended: false
            }
          ],
          costOptimizationTips: [
            {
              title: 'Unused Student Accounts',
              description: 'You have 158 unused student slots. Consider downgrading to the Professional plan to save ₦40,000/month.',
              savings: 40000,
              action: 'Downgrade Plan'
            },
            {
              title: 'Annual Billing Discount',
              description: 'Switch to annual billing to save 15% on your subscription costs.',
              savings: 153000,
              action: 'Switch to Annual'
            }
          ]
        };
        
        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { data, isLoading, error };
};

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Get billing data
  const { data: billingData, isLoading, error } = useBillingData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Unpaid': return 'text-red-600 bg-red-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton width={300} height={32} className="mb-2" />
            <Skeleton width={400} height={20} />
          </div>
          <Skeleton width={200} height={40} />
        </div>

        {/* Subscription Overview Skeleton */}
        <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Skeleton width={200} height={32} className="mb-2 bg-white bg-opacity-20" />
              <Skeleton width={300} height={20} className="mb-4 bg-white bg-opacity-20" />
              <Skeleton width={250} height={20} className="bg-white bg-opacity-20" />
            </div>
            <div className="flex flex-col md:items-end">
              <Skeleton width={150} height={40} className="mb-2 bg-white bg-opacity-20" />
              <Skeleton width={100} height={20} className="mb-4 bg-white bg-opacity-20" />
              <Skeleton width={200} height={40} className="bg-white bg-opacity-20" />
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={120} height={40} className="rounded-md" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton width={48} height={48} variant="rectangular" className="rounded-lg" />
                  <div>
                    <Skeleton width={120} height={20} className="mb-1" />
                    <Skeleton width={80} height={16} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="p-6">
            <Skeleton width={200} height={28} className="mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton width={40} height={40} variant="circular" />
                    <div>
                      <Skeleton width={200} height={20} className="mb-1" />
                      <Skeleton width={150} height={16} />
                    </div>
                  </div>
                  <Skeleton width={100} height={24} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-red-500 text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-red-700 text-lg">Error Loading Billing Data</h3>
            <p className="text-red-600">
              There was a problem loading your billing information. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="mt-3 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If data is loaded successfully
  const { 
    subscription, 
    paymentMethods, 
    invoices, 
    usageData, 
    billingHistory, 
    availablePlans, 
    costOptimizationTips 
  } = billingData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, payment methods, and billing history</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowAddPaymentModal(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Subscription Overview */}
      <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold">{subscription.plan}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white text-indigo-600`}>
                {subscription.status}
              </span>
            </div>
            <p className="text-indigo-100 mb-4">
              {subscription.billingCycle} billing • Next payment on {subscription.nextBillingDate}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-indigo-200" />
                <span className="text-indigo-100">342/500 students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-indigo-200" />
                <span className="text-indigo-100">Enterprise features</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="text-3xl font-bold">₦{subscription.amount.toLocaleString()}</div>
            <p className="text-indigo-100 mb-4">per month</p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:bg-opacity-10"
              >
                Change Plan
              </Button>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'invoices', label: 'Invoices' },
          { id: 'payment-methods', label: 'Payment Methods' },
          { id: 'usage', label: 'Usage' },
          { id: 'plans', label: 'Plans & Pricing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Current Plan</div>
                  <div className="text-xl font-bold text-dark">{subscription.plan}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Next Billing Date</div>
                  <div className="text-xl font-bold text-dark">{subscription.nextBillingDate}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Monthly Cost</div>
                  <div className="text-xl font-bold text-dark">₦{subscription.amount.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Billing Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Recent Billing Activity</h3>
            <div className="space-y-4">
              {billingHistory.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'charge' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {transaction.type === 'charge' ? (
                        <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-dark">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'charge' ? 'text-dark' : 'text-green-600'
                    }`}>
                      {transaction.type === 'charge' ? '' : '-'}
                      ₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'Successful' || transaction.status === 'Processed' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('invoices')}
                className="text-indigo-600"
              >
                View All Transactions
              </Button>
            </div>
          </Card>

          {/* Cost Optimization */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Cost Optimization</h3>
              <span className="text-sm text-gray-600">Potential savings: ₦193,000/year</span>
            </div>
            <div className="space-y-4">
              {costOptimizationTips.map((tip, index) => (
                <div key={index} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-200 rounded-full">
                      <Zap className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-dark">{tip.title}</h4>
                        <span className="text-green-600 font-bold">Save ₦{tip.savings.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{tip.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-3"
                      >
                        {tip.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Invoices & Receipts</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                            <div className="text-sm text-gray-500">{invoice.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">₦{invoice.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment-methods' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Payment Methods</h3>
              <Button onClick={() => setShowAddPaymentModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {method.brand === 'Visa' ? (
                          <span className="text-blue-600 font-bold">VISA</span>
                        ) : method.brand === 'Mastercard' ? (
                          <span className="text-red-600 font-bold">MC</span>
                        ) : (
                          <CreditCard className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-dark">
                          {method.brand} ending in {method.last4}
                          {method.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <Button size="sm" variant="outline">
                          Set as Default
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Billing Address */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Billing Address</h3>
              <Button variant="outline" size="sm">
                Edit Address
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">Brightstars Tutorial Center</p>
              <p className="text-gray-700">123 Education Street</p>
              <p className="text-gray-700">Lagos, Nigeria</p>
              <p className="text-gray-700">info@brightstars.com</p>
              <p className="text-gray-700">+234 801 234 5678</p>
            </div>
          </Card>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Resource Usage</h3>
            <div className="space-y-6">
              {/* Students Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-dark">Students</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.students.current} of {usageData.students.limit} ({usageData.students.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${usageData.students.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-dark">Storage</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.storage.current} of {usageData.storage.limit} {usageData.storage.unit} ({usageData.storage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${usageData.storage.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* API Calls Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-dark">API Calls</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.apiCalls.current.toLocaleString()} of {usageData.apiCalls.limit.toLocaleString()} ({usageData.apiCalls.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${usageData.apiCalls.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Analytics */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Usage Analytics</h3>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Usage analytics chart would be displayed here</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Plans & Pricing Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availablePlans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`border rounded-xl p-6 ${
                    plan.recommended 
                      ? 'border-indigo-500 bg-indigo-50 relative' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-dark mb-2">{plan.name}</h4>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-dark">₦{plan.price.toLocaleString()}</span>
                    <span className="text-gray-600">/month</span>
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
                    variant={plan.recommended ? 'outline' : 'primary'}
                    className="w-full"
                  >
                    {plan.recommended ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Custom Plan */}
          <Card className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Need a Custom Plan?</h3>
                <p className="text-gray-300 mb-4">
                  Contact our sales team for a tailored solution that meets your specific requirements.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Custom student limits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </div>
              <div>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Contact Sales
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal 
        isOpen={showAddPaymentModal} 
        onClose={() => setShowAddPaymentModal(false)} 
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal 
        isOpen={showInvoiceModal} 
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

// Add Payment Method Modal Component
const AddPaymentMethodModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [paymentType, setPaymentType] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    setAsDefault: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setCardData({
      ...cardData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Payment Method" className="max-w-lg">
      <div className="space-y-6">
        {/* Payment Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Payment Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentType('card')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentType === 'card'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Credit/Debit Card</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentType('bank')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentType === 'bank'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Bank Account</div>
            </button>
          </div>
        </div>

        {paymentType === 'card' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Cardholder Name */}
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={cardData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    id="expiryMonth"
                    name="expiryMonth"
                    value={cardData.expiryMonth}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    id="expiryYear"
                    name="expiryYear"
                    value={cardData.expiryYear}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  maxLength={4}
                />
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="setAsDefault"
                name="setAsDefault"
                checked={cardData.setAsDefault}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="setAsDefault" className="ml-2 block text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>

            {/* Security Note */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Payment Method
              </Button>
            </div>
          </form>
        )}

        {paymentType === 'bank' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">
                To add a bank account, please contact our support team. We'll guide you through the process.
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Contact Support
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Invoice Detail Modal Component
const InvoiceDetailModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  invoice: any;
}> = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice ${invoice.id}`} className="max-w-2xl">
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-dark">{invoice.description}</h3>
            <p className="text-gray-600">
              {new Date(invoice.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </span>
        </div>

        {/* Invoice Details */}
        <div className="border-t border-b border-gray-200 py-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium">{invoice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{invoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Period:</span>
              <span className="font-medium">
                {new Date(invoice.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <h4 className="font-medium text-dark mb-3">Invoice Items</h4>
          <div className="space-y-2">
            {invoice.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{item.description}</span>
                <span className="font-medium">₦{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Total */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-bold text-dark">Total</span>
            <span className="text-xl font-bold text-dark">₦{invoice.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Billing;