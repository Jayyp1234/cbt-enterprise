import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Settings, CreditCard, 
  DollarSign, Bell, Mail, Phone, Shield,
  AlertTriangle, CheckCircle, Clock, Calendar
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import { 
  useGetPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
  PaymentSettingsRequest
} from '../../../store/services/paymentsApi';

const PaymentSettings: React.FC = () => {
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch payment settings using RTK Query
  const { 
    data: settings, 
    isLoading, 
    error 
  } = useGetPaymentSettingsQuery();

  // Mutation for updating settings
  const [updateSettings, { isLoading: isUpdating }] = useUpdatePaymentSettingsMutation();

  // Local state for settings
  const [generalSettings, setGeneralSettings] = useState({
    defaultCurrency: 'NGN',
    allowPartialPayments: true,
    minimumPartialPercentage: 50,
    autoSendReceipts: true,
    autoSendReminders: true,
    reminderFrequency: 'weekly',
    reminderDays: 3,
    paymentExpiryDays: 30,
    overdueAfterDays: 7
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newPaymentNotification: true,
    partialPaymentNotification: true,
    completedPaymentNotification: true,
    failedPaymentNotification: true,
    reminderSentNotification: true,
    notificationRecipients: 'admin@brightstars.com, finance@brightstars.com'
  });

  const [paymentMethods, setPaymentMethods] = useState({
    cardPayments: true,
    bankTransfer: true,
    ussd: true,
    mobileMoney: false,
    qrCode: false,
    processingFee: 1.5,
    absorbFees: false
  });

  // Update local state when API data is loaded
  React.useEffect(() => {
    if (settings) {
      setGeneralSettings(settings.generalSettings);
      setNotificationSettings(settings.notificationSettings);
      setPaymentMethods(settings.paymentMethods);
    }
  }, [settings]);

  const handleGeneralSettingsChange = (field: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotificationSettingsChange = (field: string, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePaymentMethodsChange = (field: string, value: any) => {
    setPaymentMethods(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedSettings: PaymentSettingsRequest = {
        generalSettings,
        notificationSettings,
        paymentMethods
      };
      
      await updateSettings(updatedSettings).unwrap();
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Failed to update payment settings:', error);
      // Show error message
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
          <Skeleton width={150} height={36} />
        </div>

        {/* Content Skeleton */}
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
            <Skeleton height={48} className="rounded-lg" />
            <Skeleton width={150} height={20} className="mb-2" />
            <Skeleton height={48} className="rounded-lg" />
          </div>
        </Card>
      </div>
    );
  }

  // Error state - use fallback data
  if (error) {
    console.error('Payment Settings API error:', error);
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
            <h1 className="text-2xl font-bold text-dark">Payment Settings</h1>
            <p className="text-gray-600">Configure payment options and preferences</p>
          </div>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSaveChanges} 
            className="bg-green-500 hover:bg-green-600"
            disabled={isUpdating}
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
        )}
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">General Settings</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
              <select
                value={generalSettings.defaultCurrency}
                onChange={(e) => handleGeneralSettingsChange('defaultCurrency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Expiry (Days)</label>
              <input
                type="number"
                value={generalSettings.paymentExpiryDays}
                onChange={(e) => handleGeneralSettingsChange('paymentExpiryDays', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark">Allow Partial Payments</h4>
              <p className="text-sm text-gray-600">Enable students to make partial payments</p>
            </div>
            <button
              onClick={() => handleGeneralSettingsChange('allowPartialPayments', !generalSettings.allowPartialPayments)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                generalSettings.allowPartialPayments ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  generalSettings.allowPartialPayments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {generalSettings.allowPartialPayments && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Partial Payment Percentage</label>
              <input
                type="range"
                min="10"
                max="90"
                value={generalSettings.minimumPartialPercentage}
                onChange={(e) => handleGeneralSettingsChange('minimumPartialPercentage', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>10%</span>
                <span className="font-medium">{generalSettings.minimumPartialPercentage}%</span>
                <span>90%</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark">Automatically Send Receipts</h4>
              <p className="text-sm text-gray-600">Send email receipts for all payments</p>
            </div>
            <button
              onClick={() => handleGeneralSettingsChange('autoSendReceipts', !generalSettings.autoSendReceipts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                generalSettings.autoSendReceipts ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  generalSettings.autoSendReceipts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days Until Overdue</label>
              <input
                type="number"
                value={generalSettings.overdueAfterDays}
                onChange={(e) => handleGeneralSettingsChange('overdueAfterDays', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days after which a partial payment is marked as overdue
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Reminder Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Reminder Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark">Automatic Payment Reminders</h4>
              <p className="text-sm text-gray-600">Send automatic reminders for partial payments</p>
            </div>
            <button
              onClick={() => handleGeneralSettingsChange('autoSendReminders', !generalSettings.autoSendReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                generalSettings.autoSendReminders ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  generalSettings.autoSendReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {generalSettings.autoSendReminders && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                <select
                  value={generalSettings.reminderFrequency}
                  onChange={(e) => handleGeneralSettingsChange('reminderFrequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days Before Sending First Reminder</label>
                <input
                  type="number"
                  value={generalSettings.reminderDays}
                  onChange={(e) => handleGeneralSettingsChange('reminderDays', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of days after partial payment before sending the first reminder
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Notification Settings</h3>
        <div className="space-y-6">
          <div className="space-y-3">
            {[
              { key: 'newPaymentNotification', label: 'New Payment Notifications', description: 'Receive notifications for new payments' },
              { key: 'partialPaymentNotification', label: 'Partial Payment Notifications', description: 'Receive notifications for partial payments' },
              { key: 'completedPaymentNotification', label: 'Completed Payment Notifications', description: 'Receive notifications when payments are completed' },
              { key: 'failedPaymentNotification', label: 'Failed Payment Notifications', description: 'Receive notifications for failed payments' },
              { key: 'reminderSentNotification', label: 'Reminder Sent Notifications', description: 'Receive notifications when reminders are sent' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">{setting.label}</h4>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationSettingsChange(
                    setting.key, 
                    !notificationSettings[setting.key as keyof typeof notificationSettings]
                  )}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings[setting.key as keyof typeof notificationSettings] ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings[setting.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Recipients</label>
            <textarea
              value={notificationSettings.notificationRecipients}
              onChange={(e) => handleNotificationSettingsChange('notificationRecipients', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter email addresses, separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              These email addresses will receive all payment notifications
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Payment Methods</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'cardPayments', label: 'Card Payments', icon: CreditCard },
              { key: 'bankTransfer', label: 'Bank Transfer', icon: DollarSign },
              { key: 'ussd', label: 'USSD Payments', icon: Phone },
              { key: 'mobileMoney', label: 'Mobile Money', icon: Phone },
              { key: 'qrCode', label: 'QR Code Payments', icon: CreditCard }
            ].map((method) => (
              <div key={method.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <method.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-medium text-dark">{method.label}</span>
                </div>
                <button
                  onClick={() => handlePaymentMethodsChange(
                    method.key, 
                    !paymentMethods[method.key as keyof typeof paymentMethods]
                  )}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    paymentMethods[method.key as keyof typeof paymentMethods] ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      paymentMethods[method.key as keyof typeof paymentMethods] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={paymentMethods.processingFee}
                onChange={(e) => handlePaymentMethodsChange('processingFee', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-dark">Absorb Processing Fees</h4>
                <p className="text-sm text-gray-600">Institution pays the processing fees</p>
              </div>
              <button
                onClick={() => handlePaymentMethodsChange('absorbFees', !paymentMethods.absorbFees)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  paymentMethods.absorbFees ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paymentMethods.absorbFees ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-dark mb-6">Security Settings</h3>
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Payment Security</h4>
                <p className="text-sm text-yellow-700">
                  All payment information is securely processed and encrypted. We do not store any sensitive payment details on our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark">Email Verification for Payments</h4>
              <p className="text-sm text-gray-600">Require email verification for all payments</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-dark">Fraud Protection</h4>
              <p className="text-sm text-gray-600">Enable advanced fraud detection</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`}
              />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSettings;