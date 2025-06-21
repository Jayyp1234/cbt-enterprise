import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Copy, Share2, Eye, 
  Link, Calendar, DollarSign, Users,
  CheckCircle, XCircle, AlertTriangle, MoreHorizontal,
  Download, Send, Ban, RefreshCw, Plus
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Skeleton from '../../../components/ui/Skeleton';
import { 
  useGetPaymentLinkByIdQuery,
  useGetTransactionsQuery,
  useGetPartialPaymentsQuery,
  useTogglePaymentLinkStatusMutation,
  useSendRemindersMutation,
  PaymentFilters
} from '../../../store/services/paymentsApi';

const PaymentLinkDetail: React.FC = () => {
  const { id } = useParams();
  const linkId = parseInt(id || '1');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  // Fetch payment link data using RTK Query
  const { 
    data: paymentLink, 
    isLoading: isLoadingLink, 
    error: linkError 
  } = useGetPaymentLinkByIdQuery(linkId);

  // Fetch transactions for this payment link
  const transactionFilters: PaymentFilters = {
    paymentLinkId: linkId
  };
  
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions 
  } = useGetTransactionsQuery(transactionFilters, {
    skip: activeTab !== 'transactions'
  });

  // Fetch partial payments for this payment link
  const { 
    data: partialPayments = [], 
    isLoading: isLoadingPartial 
  } = useGetPartialPaymentsQuery({ paymentLinkId: linkId }, {
    skip: activeTab !== 'partial'
  });

  // Mutations
  const [toggleStatus, { isLoading: isTogglingStatus }] = useTogglePaymentLinkStatusMutation();
  const [sendReminders, { isLoading: isSendingReminders }] = useSendRemindersMutation();

  const handleSelectTransaction = (id: number) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(prev => prev.filter(txnId => txnId !== id));
    } else {
      setSelectedTransactions(prev => [...prev, id]);
    }
  };

  const handleActionConfirm = () => {
    // Perform the bulk action
    console.log(`Performing action on transactions:`, selectedTransactions);
    setShowSendReminderModal(false);
    setSelectedTransactions([]);
    // Show success message and redirect
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const handleToggleLinkStatus = async () => {
    if (!paymentLink) return;
    
    const newStatus = paymentLink.status === 'Active' ? 'Paused' : 'Active';
    try {
      await toggleStatus({ id: linkId, status: newStatus }).unwrap();
      // Success notification would go here
    } catch (error) {
      console.error(`Failed to toggle status:`, error);
      // Error notification would go here
    }
  };

  const handleSendReminders = async () => {
    if (selectedTransactions.length === 0) {
      setShowSendReminderModal(true);
      return;
    }
    
    try {
      await sendReminders({
        recipients: selectedTransactions,
        subject: 'Complete Your Payment',
        message: 'Please complete your payment for the course.',
        channels: ['email', 'sms'],
        includePaymentLink: true,
        scheduleType: 'now'
      }).unwrap();
      
      setSelectedTransactions([]);
      // Success notification would go here
    } catch (error) {
      console.error('Failed to send reminders:', error);
      // Error notification would go here
    }
  };

  // Loading state
  if (isLoadingLink) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton width={100} height={36} />
            <div>
              <Skeleton width={300} height={32} className="mb-2" />
              <Skeleton width={200} height={20} />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton width={100} height={36} />
            <Skeleton width={100} height={36} />
            <Skeleton width={100} height={36} />
          </div>
        </div>

        {/* Payment Link Overview Skeleton */}
        <Skeleton height={150} className="rounded-xl" />

        {/* Payment Link URL Skeleton */}
        <Skeleton height={60} className="rounded-lg" />

        {/* Tabs Skeleton */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={120} height={40} className="rounded-md" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={120} className="rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error state - use fallback data
  if (linkError || !paymentLink) {
    console.error('Payment Link API error:', linkError);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/payments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">{paymentLink?.title}</h1>
            <p className="text-gray-600">Payment Link ID: {paymentLink?.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => navigate(`/payments/link/${id}/edit`)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Link
          </Button>
          <Button 
            variant="outline" 
            onClick={handleToggleLinkStatus}
            className={paymentLink?.status === 'Active' ? 'text-yellow-600' : 'text-green-600'}
            disabled={isTogglingStatus}
          >
            {paymentLink?.status === 'Active' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Payment Link Overview */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-xl font-bold text-dark">{paymentLink?.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentLink?.status || 'Active')}`}>
                {paymentLink?.status}
              </span>
            </div>
            <p className="text-indigo-700 mb-4">{paymentLink?.description}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600">Created: {paymentLink?.created}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600">Expires: {paymentLink?.expires}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600">{paymentLink?.collected}/{paymentLink?.maxPayments} payments</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="text-3xl font-bold text-indigo-600">₦{paymentLink?.amount.toLocaleString()}</div>
            <div className="text-sm text-indigo-600 mb-2">per student</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Total Collected:</span>
              <span className="font-bold text-green-600">₦{paymentLink?.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Link URL */}
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Link className="w-5 h-5 text-gray-500" />
          <div className="flex-1 font-mono text-sm text-gray-700 bg-gray-50 p-3 rounded-lg overflow-x-auto">
            {paymentLink?.url}
          </div>
          <Button size="sm" variant="outline" onClick={() => copyToClipboard(paymentLink?.url || '')}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'partial', label: 'Partial Payments' },
          { id: 'settings', label: 'Settings' },
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
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">₦{paymentLink?.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Payment Amount</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">{paymentLink?.completedPayments}</div>
                  <div className="text-sm text-gray-600">Completed Payments</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">{paymentLink?.partialPayments}</div>
                  <div className="text-sm text-gray-600">Partial Payments</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark">₦{paymentLink?.pendingAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pending Amount</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Link Details */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-4">Payment Link Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium text-dark">{paymentLink?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-dark">₦{paymentLink?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created Date:</span>
                  <span className="font-medium text-dark">{paymentLink?.created}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium text-dark">{paymentLink?.expires}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created By:</span>
                  <span className="font-medium text-dark">{paymentLink?.createdBy}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    paymentLink?.status === 'Active' ? 'text-green-600' : 
                    paymentLink?.status === 'Paused' ? 'text-yellow-600' : 
                    paymentLink?.status === 'Completed' ? 'text-blue-600' : 'text-red-600'
                  }`}>{paymentLink?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partial Payments:</span>
                  <span className="font-medium text-dark">{paymentLink?.allowPartialPayment ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                {paymentLink?.allowPartialPayment && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Payment:</span>
                    <span className="font-medium text-dark">₦{paymentLink?.minimumPayment?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Payments:</span>
                  <span className="font-medium text-dark">{paymentLink?.maxPayments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom Fields:</span>
                  <span className="font-medium text-dark">{paymentLink?.customFields.join(', ')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Recent Transactions</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('transactions')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {isLoadingTransactions ? (
                // Loading state for transactions
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton width={40} height={40} variant="circular" />
                      <div>
                        <Skeleton width={150} height={20} className="mb-1" />
                        <Skeleton width={200} height={16} />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton width={100} height={20} className="mb-1" />
                      <Skeleton width={80} height={16} />
                    </div>
                  </div>
                ))
              ) : transactions.length > 0 ? (
                transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {transaction.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-dark">{transaction.studentName}</div>
                        <div className="text-sm text-gray-600">{transaction.email} • {transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-dark">₦{transaction.amount.toLocaleString()}</div>
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        {transaction.isPartial && (
                          <span className="text-xs text-gray-600">
                            Remaining: ₦{transaction.remainingAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No transactions found for this payment link.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">All Transactions</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingTransactions ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton width={40} height={40} variant="circular" />
                      <div>
                        <Skeleton width={150} height={20} className="mb-1" />
                        <Skeleton width={200} height={16} />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton width={100} height={20} className="mb-1" />
                      <Skeleton width={80} height={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTransactions(transactions.map(t => t.id));
                            } else {
                              setSelectedTransactions([]);
                            }
                          }}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.includes(transaction.id)}
                            onChange={() => handleSelectTransaction(transaction.id)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {transaction.studentName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                              <div className="text-xs text-gray-500">{transaction.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">₦{transaction.amount.toLocaleString()}</div>
                          {transaction.isPartial && (
                            <div className="text-xs text-yellow-600">
                              Remaining: ₦{transaction.remainingAmount.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">{transaction.reference}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {transaction.isPartial && (
                              <button className="text-yellow-600 hover:text-yellow-900">
                                <Bell className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedTransactions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedTransactions.length} transaction(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleSendReminders}>
                      <Bell className="w-4 h-4 mr-2" />
                      Send Reminders
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Partial Payments Tab */}
      {activeTab === 'partial' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark">Partial Payments</h3>
              <Button onClick={() => setShowSendReminderModal(true)}>
                <Bell className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingPartial ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton width={40} height={40} variant="circular" />
                      <div>
                        <Skeleton width={150} height={20} className="mb-1" />
                        <Skeleton width={200} height={16} className="mb-1" />
                        <Skeleton width={180} height={16} />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton width={100} height={36} />
                      <Skeleton width={100} height={36} />
                    </div>
                  </div>
                ))}
              </div>
            ) : partialPayments.length > 0 ? (
              <div className="space-y-4">
                {partialPayments.map((payment) => (
                  <div key={payment.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {payment.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-dark">{payment.studentName}</div>
                          <div className="text-sm text-gray-600">{payment.email}</div>
                          <div className="text-sm text-gray-600">
                            Student ID: {payment.studentId} • Class: {payment.class}
                          </div>
                          <div className="text-sm text-gray-600">
                            Parent Phone: {payment.parentPhone}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-green-600 font-medium">
                              Paid: ₦{payment.amountPaid.toLocaleString()}
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-red-600 font-medium">
                              Remaining: ₦{payment.remainingAmount.toLocaleString()}
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-gray-600">
                              Date: {payment.lastPaymentDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Bell className="w-4 h-4 mr-2" />
                          Remind
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Partial Payments</h3>
                <p className="text-gray-500">
                  There are no partial payments for this payment link.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Payment Link Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Link Status</h4>
                  <p className="text-sm text-gray-600">Enable or disable this payment link</p>
                </div>
                <button
                  onClick={handleToggleLinkStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    paymentLink?.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      paymentLink?.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Partial Payments</h4>
                  <p className="text-sm text-gray-600">Allow students to make partial payments</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    paymentLink?.allowPartialPayment ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      paymentLink?.allowPartialPayment ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Automatic Reminders</h4>
                  <p className="text-sm text-gray-600">Send automatic reminders for partial payments</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full bg-green-500`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Email Receipts</h4>
                  <p className="text-sm text-gray-600">Send email receipts for payments</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-green-500`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Send Reminder Modal */}
      <SendReminderModal 
        isOpen={showSendReminderModal} 
        onClose={() => setShowSendReminderModal(false)}
        selectedTransactions={selectedTransactions}
        transactions={partialPayments}
        onSendReminders={sendReminders}
        isSending={isSendingReminders}
      />

      {/* Share Modal */}
      <SharePaymentLinkModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        paymentLink={paymentLink}
      />
    </div>
  );
};

// Send Reminder Modal Component
const SendReminderModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  selectedTransactions: number[];
  transactions: any[];
  onSendReminders: any;
  isSending: boolean;
}> = ({ isOpen, onClose, selectedTransactions, transactions, onSendReminders, isSending }) => {
  const [reminderData, setReminderData] = useState({
    subject: 'Reminder: Complete Your Payment',
    message: 'Dear student,\n\nThis is a friendly reminder to complete your payment for the course. Please click on the payment link to make the remaining payment.\n\nThank you,\nBrightstars Tutorial Center',
    sendVia: ['email', 'sms'],
    includePaymentLink: true
  });

  const filteredTransactions = selectedTransactions.length > 0
    ? transactions.filter(t => selectedTransactions.includes(t.id))
    : transactions;

  const handleSendReminders = async () => {
    try {
      await onSendReminders({
        recipients: selectedTransactions.length > 0 ? selectedTransactions : transactions.map(t => t.id),
        subject: reminderData.subject,
        message: reminderData.message,
        channels: reminderData.sendVia,
        includePaymentLink: reminderData.includePaymentLink,
        scheduleType: 'now'
      }).unwrap();
      
      onClose();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to send reminders:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Payment Reminders" className="max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
          <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                        {transaction.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{transaction.studentName}</span>
                    </div>
                    <div className="text-sm text-red-600">
                      Remaining: ₦{transaction.remainingAmount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No recipients selected</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={reminderData.subject}
            onChange={(e) => setReminderData({...reminderData, subject: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={reminderData.message}
            onChange={(e) => setReminderData({...reminderData, message: e.target.value})}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Send Via</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reminderData.sendVia.includes('email')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setReminderData({...reminderData, sendVia: [...reminderData.sendVia, 'email']});
                  } else {
                    setReminderData({...reminderData, sendVia: reminderData.sendVia.filter(v => v !== 'email')});
                  }
                }}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reminderData.sendVia.includes('sms')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setReminderData({...reminderData, sendVia: [...reminderData.sendVia, 'sms']});
                  } else {
                    setReminderData({...reminderData, sendVia: reminderData.sendVia.filter(v => v !== 'sms')});
                  }
                }}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">SMS</span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={reminderData.includePaymentLink}
            onChange={(e) => setReminderData({...reminderData, includePaymentLink: e.target.checked})}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Include payment link in message</span>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSending}>
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSendReminders}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reminders
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Share Payment Link Modal Component
const SharePaymentLinkModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  paymentLink: any;
}> = ({ isOpen, onClose, paymentLink }) => {
  const [shareData, setShareData] = useState({
    method: 'copy',
    recipients: '',
    message: ''
  });

  // Update message when payment link changes
  React.useEffect(() => {
    if (paymentLink) {
      setShareData({
        ...shareData,
        message: `Please use this link to make your payment for ${paymentLink.title}: ${paymentLink.url}`
      });
    }
  }, [paymentLink]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink?.url || '');
    // Show success message
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Payment Link" className="max-w-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Share Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShareData({...shareData, method: 'copy'})}
              className={`p-4 border-2 rounded-lg transition-colors ${
                shareData.method === 'copy'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Copy className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Copy Link</div>
            </button>
            <button
              onClick={() => setShareData({...shareData, method: 'email'})}
              className={`p-4 border-2 rounded-lg transition-colors ${
                shareData.method === 'email'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Email</div>
            </button>
            <button
              onClick={() => setShareData({...shareData, method: 'sms'})}
              className={`p-4 border-2 rounded-lg transition-colors ${
                shareData.method === 'sms'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Bell className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">SMS</div>
            </button>
          </div>
        </div>

        {shareData.method === 'copy' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={paymentLink?.url}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
              />
              <Button onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {shareData.method === 'email' ? 'Email Recipients' : 'Phone Numbers'}
              </label>
              <textarea
                value={shareData.recipients}
                onChange={(e) => setShareData({...shareData, recipients: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={shareData.method === 'email' 
                  ? "Enter email addresses, separated by commas" 
                  : "Enter phone numbers, separated by commas"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={shareData.message}
                onChange={(e) => setShareData({...shareData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {shareData.method === 'copy' ? (
            <Button className="flex-1" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          ) : (
            <Button className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              {shareData.method === 'email' ? 'Send Email' : 'Send SMS'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ExternalLink component
const ExternalLink: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// Pause component
const Pause: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

// Play component
const Play: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export default PaymentLinkDetail;