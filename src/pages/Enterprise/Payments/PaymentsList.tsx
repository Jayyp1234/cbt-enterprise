import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Link, Copy, Share2, Eye, Edit3, 
  Trash2, DollarSign, Calendar, Users,
  TrendingUp, Wallet, Clock, CheckCircle,
  AlertCircle, Download, Filter, Search,
  MoreHorizontal, Bell, Pause, Play
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Skeleton from '../../../components/ui/Skeleton';
import SkeletonCard from '../../../components/ui/SkeletonCard';
import { 
  useGetPaymentLinksQuery, 
  useCreatePaymentLinkMutation,
  useTogglePaymentLinkStatusMutation,
  PaymentFilters
} from '../../../store/services/paymentsApi';

const PaymentsList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('links');
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Create filters object
  const filters: PaymentFilters = {
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
    search: searchQuery || undefined
  };

  // Fetch payment links using RTK Query
  const { 
    data: paymentLinks, 
    isLoading, 
    isFetching, 
    error 
  } = useGetPaymentLinksQuery(filters);

  // Mutations
  const [createPaymentLink, { isLoading: isCreating }] = useCreatePaymentLinkMutation();
  const [toggleStatus, { isLoading: isToggling }] = useTogglePaymentLinkStatusMutation();

  // Mock data for wallet overview (would come from API in real app)
  const walletData = {
    balance: 450000,
    pendingPayments: 125000,
    totalRevenue: 2450000,
    monthlyRevenue: 380000,
    partialPaymentsTotal: 137500,
    overduePayments: 45000
  };

  const statusOptions = ['All', 'Active', 'Completed', 'Paused', 'Expired'];

  const filteredLinks = paymentLinks || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const handleToggleLinkStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    try {
      await toggleStatus({ id, status: newStatus }).unwrap();
      // Success notification would go here
    } catch (error) {
      console.error('Failed to toggle status:', error);
      // Error notification would go here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Payment Management</h1>
          <p className="text-gray-600">Manage payment links and track transactions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/payments/reminders')}>
            <Bell className="w-4 h-4 mr-2" />
            Reminders
          </Button>
          <Button onClick={() => setShowCreateLinkModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Payment Link
          </Button>
        </div>
      </div>

      {/* Enhanced Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-100">Wallet Balance</h3>
              <div className="text-3xl font-bold">₦{(walletData.balance / 1000).toFixed(0)}K</div>
            </div>
            <Wallet className="w-12 h-12 text-green-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-100">Pending Payments</h3>
              <div className="text-3xl font-bold">₦{(walletData.pendingPayments / 1000).toFixed(0)}K</div>
            </div>
            <Clock className="w-12 h-12 text-blue-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-purple-100">Total Revenue</h3>
              <div className="text-3xl font-bold">₦{(walletData.totalRevenue / 1000000).toFixed(1)}M</div>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-orange-100">This Month</h3>
              <div className="text-3xl font-bold">₦{(walletData.monthlyRevenue / 1000).toFixed(0)}K</div>
            </div>
            <DollarSign className="w-12 h-12 text-orange-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-yellow-100">Partial Payments</h3>
              <div className="text-3xl font-bold">₦{(walletData.partialPaymentsTotal / 1000).toFixed(0)}K</div>
            </div>
            <AlertCircle className="w-12 h-12 text-yellow-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-100">Overdue</h3>
              <div className="text-3xl font-bold">₦{(walletData.overduePayments / 1000).toFixed(0)}K</div>
            </div>
            <AlertCircle className="w-12 h-12 text-red-200" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'links', label: 'Payment Links' },
          { id: 'transactions', label: 'Transactions', action: () => navigate('/payments/transactions') },
          { id: 'analytics', label: 'Analytics', action: () => navigate('/payments/analytics') },
          { id: 'settings', label: 'Settings', action: () => navigate('/payments/settings') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={tab.action || (() => setActiveTab(tab.id))}
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

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payment links..."
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} hasImage={false} hasFooter={true} className="p-6" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700 text-lg">Error Loading Payment Links</h3>
              <p className="text-red-600">
                There was a problem loading the payment links. Please try again later.
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
        </Card>
      )}

      {/* Payment Links */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <Card key={link.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-dark text-lg">{link.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(link.status)}`}>
                        {link.status}
                      </span>
                      {link.allowPartialPayment && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          Partial Payments
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{link.description}</p>
                    <p className="text-sm text-gray-500">Created: {link.created} • Expires: {link.expires}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleLinkStatus(link.id, link.status)}
                      className={link.status === 'Active' ? 'text-yellow-600' : 'text-green-600'}
                      disabled={isToggling}
                    >
                      {link.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => copyToClipboard(link.url)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => navigate(`/payments/link/${link.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => navigate(`/payments/link/${link.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Link"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">₦{link.amount.toLocaleString()}</div>
                    <div className="text-sm text-blue-600">Amount</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{link.collected}</div>
                    <div className="text-sm text-green-600">Total Payments</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">₦{link.totalAmount.toLocaleString()}</div>
                    <div className="text-sm text-purple-600">Total Collected</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">{link.completedPayments}</div>
                    <div className="text-sm text-emerald-600">Completed</div>
                  </div>
                  {link.allowPartialPayment && (
                    <>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-xl font-bold text-yellow-600">{link.partialPayments}</div>
                        <div className="text-sm text-yellow-600">Partial</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">₦{link.pendingAmount.toLocaleString()}</div>
                        <div className="text-sm text-red-600">Pending</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{link.collected}/{link.maxPayments} payments</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(link.collected / link.maxPayments) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Payment Link URL */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Link className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 font-mono truncate">{link.url}</span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/payments/link/${link.id}`)}>
                        View Details
                      </Button>
                      {link.partialPayments > 0 && (
                        <Button size="sm" variant="outline" className="text-yellow-600" onClick={() => navigate('/payments/reminders')}>
                          <Bell className="w-4 h-4 mr-1" />
                          Send Reminders
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <div className="py-8">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Payment Links Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedStatus !== 'All' 
                    ? 'No payment links match your search criteria. Try adjusting your filters.'
                    : 'You haven\'t created any payment links yet.'}
                </p>
                <Button onClick={() => setShowCreateLinkModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Payment Link
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Create Payment Link Modal */}
      <CreatePaymentLinkModal 
        isOpen={showCreateLinkModal} 
        onClose={() => setShowCreateLinkModal(false)} 
        onCreateLink={createPaymentLink}
        isLoading={isCreating}
      />
    </div>
  );
};

// Create Payment Link Modal Component
const CreatePaymentLinkModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onCreateLink: (data: any) => Promise<any>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onCreateLink, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'NGN',
    allowPartialPayment: false,
    partialPercentage: 50,
    expiryDate: '',
    maxPayments: '',
    collectStudentInfo: true,
    sendReceipt: true,
    customFields: [] as string[],
  });

  const handleAddCustomField = () => {
    setFormData({
      ...formData,
      customFields: [...formData.customFields, '']
    });
  };

  const handleCustomFieldChange = (index: number, value: string) => {
    const updatedFields = [...formData.customFields];
    updatedFields[index] = value;
    setFormData({
      ...formData,
      customFields: updatedFields
    });
  };

  const handleRemoveCustomField = (index: number) => {
    setFormData({
      ...formData,
      customFields: formData.customFields.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    try {
      await onCreateLink(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        currency: 'NGN',
        allowPartialPayment: false,
        partialPercentage: 50,
        expiryDate: '',
        maxPayments: '',
        collectStudentInfo: true,
        sendReceipt: true,
        customFields: [],
      });
    } catch (error) {
      console.error('Failed to create payment link:', error);
      // Error notification would go here
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Payment Link" className="max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., JAMB Preparation Course"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe what this payment is for..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="25000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.allowPartialPayment}
              onChange={(e) => setFormData({...formData, allowPartialPayment: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Allow Partial Payments</span>
          </label>
          {formData.allowPartialPayment && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payment Percentage</label>
              <input
                type="range"
                min="10"
                max="90"
                value={formData.partialPercentage}
                onChange={(e) => setFormData({...formData, partialPercentage: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>10%</span>
                <span className="font-medium">{formData.partialPercentage}% (₦{Math.round((parseInt(formData.amount) || 0) * formData.partialPercentage / 100).toLocaleString()})</span>
                <span>90%</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Payments (Optional)</label>
            <input
              type="number"
              value={formData.maxPayments}
              onChange={(e) => setFormData({...formData, maxPayments: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.collectStudentInfo}
              onChange={(e) => setFormData({...formData, collectStudentInfo: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Collect Student Information</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.sendReceipt}
              onChange={(e) => setFormData({...formData, sendReceipt: e.target.checked})}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Send Email Receipt</span>
          </label>
        </div>

        {/* Custom Fields */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Custom Fields</label>
            <Button size="sm" variant="outline" onClick={handleAddCustomField}>
              <Plus className="w-4 h-4 mr-1" />
              Add Field
            </Button>
          </div>
          
          {formData.customFields.length > 0 ? (
            <div className="space-y-3">
              {formData.customFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Field name (e.g., Student ID, Class, etc.)"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleRemoveCustomField(index)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No custom fields added. Click the button above to add fields.</p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Create Payment Link
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentsList;