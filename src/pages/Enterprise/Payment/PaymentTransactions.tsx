import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, 
  Trash2, DollarSign, Calendar, Users,
  CheckCircle, Clock, AlertCircle, Bell,
  RefreshCw, ArrowLeft, FileText, Mail
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Skeleton from '../../../components/ui/Skeleton';
import SkeletonTable from '../../../components/ui/SkeletonTable';
import { 
  useGetTransactionsQuery,
  useSendReceiptMutation,
  useExportTransactionsMutation,
  Transaction,
  PaymentFilters
} from '../../../store/services/paymentsApi';

const PaymentTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentLink, setSelectedPaymentLink] = useState('All');
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [showTransactionDetailModal, setShowTransactionDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showSendReceiptModal, setShowSendReceiptModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Create filters for the query
  const filters: PaymentFilters = {
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
    search: searchQuery || undefined,
    dateFrom: dateRange.start || undefined,
    dateTo: dateRange.end || undefined,
    paymentLinkId: selectedPaymentLink !== 'All' ? parseInt(selectedPaymentLink) : undefined
  };

  // Fetch transactions using RTK Query
  const { 
    data: transactions = [], 
    isLoading, 
    error 
  } = useGetTransactionsQuery(filters);

  // Mutations
  const [sendReceipt, { isLoading: isSendingReceipt }] = useSendReceiptMutation();
  const [exportTransactions, { isLoading: isExporting }] = useExportTransactionsMutation();

  // Mock data for payment links (would come from API in real app)
  const paymentLinks = [
    { id: 1, title: 'JAMB Preparation Course' },
    { id: 2, title: 'WAEC Tutorial Package' },
    { id: 3, title: 'Mathematics Intensive' },
    { id: 4, title: 'Physics Masterclass' }
  ];

  const statusOptions = ['All', 'Completed', 'Partial', 'Failed', 'Pending'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTransaction = (id: number) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(prev => prev.filter(txnId => txnId !== id));
    } else {
      setSelectedTransactions(prev => [...prev, id]);
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetailModal(true);
  };

  const handleSendReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowSendReceiptModal(true);
  };

  const handleBulkAction = async (action: string) => {
    if (action === 'export' && selectedTransactions.length > 0) {
      try {
        const result = await exportTransactions({
          format: 'csv',
          filters: {
            ...filters,
            // Add selected transaction IDs
          }
        }).unwrap();
        
        // Open the exported file URL
        window.open(result.url, '_blank');
      } catch (error) {
        console.error('Failed to export transactions:', error);
        // Show error message
      }
    }
    // Implement other bulk actions
  };

  // Loading state
  if (isLoading) {
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
          <Skeleton width={150} height={36} />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center space-x-3">
                <Skeleton width={48} height={48} variant="rectangular" className="rounded-lg" />
                <div>
                  <Skeleton width={80} height={32} className="mb-1" />
                  <Skeleton width={120} height={16} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton height={48} className="rounded-lg" />
            <Skeleton height={48} className="rounded-lg" />
            <Skeleton height={48} className="rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton width="50%" height={48} className="rounded-lg" />
              <Skeleton width="50%" height={48} className="rounded-lg" />
            </div>
          </div>
        </Card>

        {/* Table Skeleton */}
        <SkeletonTable rows={5} columns={8} />
      </div>
    );
  }

  // Error state - use fallback data
  if (error) {
    console.error('Transactions API error:', error);
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
            <h1 className="text-2xl font-bold text-dark">Payment Transactions</h1>
            <p className="text-gray-600">{transactions.length} transactions found</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => handleBulkAction('export')}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                ₦{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {transactions.filter(t => t.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {transactions.filter(t => t.status === 'Partial').length}
              </div>
              <div className="text-sm text-gray-600">Partial</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark">
                {transactions.filter(t => t.status === 'Failed').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
            ))}
          </select>
          <select
            value={selectedPaymentLink}
            onChange={(e) => setSelectedPaymentLink(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Payment Links</option>
            {paymentLinks.map(link => (
              <option key={link.id} value={link.id.toString()}>{link.title}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="Start Date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <input
              type="date"
              placeholder="End Date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedTransactions.length} transaction(s) selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('receipt')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Receipts
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reminder')}>
                  <Bell className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
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
                  Payment Link
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
                    <div className="text-sm text-gray-900">{transaction.paymentLink}</div>
                    <div className="text-xs text-gray-500">{transaction.method}</div>
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
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{transaction.reference}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleSendReceipt(transaction)}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      {transaction.isPartial && (
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Bell className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal 
        isOpen={showTransactionDetailModal} 
        onClose={() => setShowTransactionDetailModal(false)}
        transaction={selectedTransaction}
      />

      {/* Send Receipt Modal */}
      <SendReceiptModal 
        isOpen={showSendReceiptModal} 
        onClose={() => setShowSendReceiptModal(false)}
        transaction={selectedTransaction}
        onSendReceipt={sendReceipt}
      />
    </div>
  );
};

// Transaction Detail Modal Component
const TransactionDetailModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  transaction: Transaction | null;
}> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" className="max-w-2xl">
      <div className="space-y-6">
        {/* Transaction Status */}
        <div className={`p-4 rounded-lg ${
          transaction.status === 'Completed' ? 'bg-green-50 border border-green-200' :
          transaction.status === 'Partial' ? 'bg-yellow-50 border border-yellow-200' :
          transaction.status === 'Failed' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {transaction.status === 'Completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : transaction.status === 'Partial' ? (
                <Clock className="w-5 h-5 text-yellow-500" />
              ) : transaction.status === 'Failed' ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Clock className="w-5 h-5 text-blue-500" />
              )}
              <div>
                <h4 className={`font-medium ${
                  transaction.status === 'Completed' ? 'text-green-800' :
                  transaction.status === 'Partial' ? 'text-yellow-800' :
                  transaction.status === 'Failed' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {transaction.status} Payment
                </h4>
                <p className={`text-sm ${
                  transaction.status === 'Completed' ? 'text-green-600' :
                  transaction.status === 'Partial' ? 'text-yellow-600' :
                  transaction.status === 'Failed' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {transaction.status === 'Completed' ? 'Payment completed successfully' :
                   transaction.status === 'Partial' ? `Partial payment received, ₦${transaction.remainingAmount.toLocaleString()} remaining` :
                   transaction.status === 'Failed' ? 'Payment failed to process' :
                   'Payment is being processed'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-dark">₦{transaction.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{transaction.method}</div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-dark mb-3">Payment Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium text-dark">{transaction.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-dark">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-dark">{transaction.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Link:</span>
                <span className="font-medium text-dark">{transaction.paymentLink}</span>
              </div>
              {transaction.isPartial && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="font-medium text-green-600">₦{transaction.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Amount:</span>
                    <span className="font-medium text-red-600">₦{transaction.remainingAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-dark mb-3">Student Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-dark">{transaction.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-dark">{transaction.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student ID:</span>
                <span className="font-medium text-dark">{transaction.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium text-dark">{transaction.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parent Phone:</span>
                <span className="font-medium text-dark">{transaction.parentPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          {transaction.isPartial && (
            <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600">
              <Bell className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Send Receipt Modal Component
const SendReceiptModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  transaction: Transaction | null;
  onSendReceipt: any;
}> = ({ isOpen, onClose, transaction, onSendReceipt }) => {
  if (!transaction) return null;

  const [receiptData, setReceiptData] = useState({
    email: '',
    includePaymentDetails: true,
    includeCustomMessage: false,
    customMessage: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSendReceipt = async () => {
    if (!transaction) return;
    
    try {
      setIsSending(true);
      await onSendReceipt({
        transactionId: transaction.id,
        email: receiptData.email || transaction.email,
        includeDetails: receiptData.includePaymentDetails,
        message: receiptData.includeCustomMessage ? receiptData.customMessage : undefined
      }).unwrap();
      
      onClose();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to send receipt:', error);
      // Error notification would go here
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Receipt" className="max-w-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={receiptData.email || transaction.email}
            onChange={(e) => setReceiptData({...receiptData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={receiptData.includePaymentDetails}
              onChange={(e) => setReceiptData({...receiptData, includePaymentDetails: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Include payment details</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={receiptData.includeCustomMessage}
              onChange={(e) => setReceiptData({...receiptData, includeCustomMessage: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Include custom message</span>
          </label>
        </div>

        {receiptData.includeCustomMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message</label>
            <textarea
              value={receiptData.customMessage}
              onChange={(e) => setReceiptData({...receiptData, customMessage: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your custom message..."
            />
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-dark mb-2">Receipt Preview</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Student:</span>
              <span>{transaction.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>₦{transaction.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Link:</span>
              <span>{transaction.paymentLink}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference:</span>
              <span>{transaction.reference}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{transaction.date}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSending}>
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSendReceipt}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Receipt
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentTransactions;