import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Upload, Link, Calendar, 
  DollarSign, AlertTriangle, Plus, Trash2
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import { 
  useGetPaymentLinkByIdQuery,
  useUpdatePaymentLinkMutation
} from '../../../store/services/paymentsApi';

const PaymentLinkEdit: React.FC = () => {
  const { id } = useParams();
  const linkId = parseInt(id || '1');
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch payment link data using RTK Query
  const { 
    data: paymentLink, 
    isLoading, 
    error 
  } = useGetPaymentLinkByIdQuery(linkId);

  // Mutation for updating payment link
  const [updatePaymentLink, { isLoading: isUpdating }] = useUpdatePaymentLinkMutation();

  // Local state for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    allowPartialPayment: false,
    partialPercentage: 50,
    expiryDate: '',
    maxPayments: '',
    status: 'Active',
    collectStudentInfo: true,
    sendReceipt: true,
    customFields: [] as string[]
  });

  // Update form data when payment link data is loaded
  useEffect(() => {
    if (paymentLink) {
      setFormData({
        title: paymentLink.title,
        description: paymentLink.description,
        amount: paymentLink.amount.toString(),
        allowPartialPayment: paymentLink.allowPartialPayment,
        partialPercentage: paymentLink.minimumPayment ? Math.round((paymentLink.minimumPayment / paymentLink.amount) * 100) : 50,
        expiryDate: paymentLink.expires,
        maxPayments: paymentLink.maxPayments.toString(),
        status: paymentLink.status,
        collectStudentInfo: true, // Assuming this is always true
        sendReceipt: true, // Assuming this is always true
        customFields: [...paymentLink.customFields]
      });
    }
  }, [paymentLink]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCustomFieldChange = (index: number, value: string) => {
    const updatedFields = [...formData.customFields];
    updatedFields[index] = value;
    handleChange('customFields', updatedFields);
  };

  const addCustomField = () => {
    handleChange('customFields', [...formData.customFields, '']);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = formData.customFields.filter((_, i) => i !== index);
    handleChange('customFields', updatedFields);
  };

  const handleSave = async () => {
    try {
      await updatePaymentLink({
        id: linkId,
        ...formData,
        amount: formData.amount,
        maxPayments: formData.maxPayments
      }).unwrap();
      
      setHasChanges(false);
      navigate(`/payments/link/${id}`);
      // Success notification would go here
    } catch (error) {
      console.error('Failed to update payment link:', error);
      // Error notification would go here
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(`/payments/link/${id}`);
      }
    } else {
      navigate(`/payments/link/${id}`);
    }
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
          <div className="flex space-x-2">
            <Skeleton width={100} height={36} />
            <Skeleton width={100} height={36} />
          </div>
        </div>

        {/* Form Skeleton */}
        <Card className="p-6">
          <Skeleton width={200} height={28} className="mb-6" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton width={150} height={20} className="mb-2" />
                <Skeleton height={48} className="rounded-lg" />
              </div>
              <div>
                <Skeleton width={150} height={20} className="mb-2" />
                <Skeleton height={48} className="rounded-lg" />
              </div>
            </div>
            <Skeleton width={150} height={20} className="mb-2" />
            <Skeleton height={100} className="rounded-lg" />
          </div>
        </Card>
      </div>
    );
  }

  // Error state - use fallback data
  if (error || !paymentLink) {
    console.error('Payment Link API error:', error);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payment Link
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dark">Edit Payment Link</h1>
            <p className="text-gray-600">Payment Link ID: {id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isUpdating}
            className={hasChanges ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Basic Information</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Payments</label>
              <input
                type="number"
                value={formData.maxPayments}
                onChange={(e) => handleChange('maxPayments', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Options */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Payment Options</h3>
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.allowPartialPayment}
                onChange={(e) => handleChange('allowPartialPayment', e.target.checked)}
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
                  onChange={(e) => handleChange('partialPercentage', parseInt(e.target.value))}
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

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.collectStudentInfo}
                onChange={(e) => handleChange('collectStudentInfo', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Collect Student Information</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.sendReceipt}
                onChange={(e) => handleChange('sendReceipt', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Send Email Receipt</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Custom Fields */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark">Custom Fields</h3>
          <Button variant="outline" onClick={addCustomField}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
        <div className="space-y-4">
          {formData.customFields.map((field, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={field}
                onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Field name (e.g., Student ID, Class, etc.)"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeCustomField(index)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {formData.customFields.length === 0 && (
            <p className="text-sm text-gray-500">No custom fields added. Click the button above to add fields.</p>
          )}
        </div>
      </Card>

      {/* Warning */}
      <Card className="p-6 bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
            <p className="text-yellow-700 text-sm">
              Changing the payment amount will only affect new payments. Existing payments and partial payments will not be affected.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentLinkEdit;