import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Globe, Palette, 
  Shield, Bell, CreditCard, Users, 
  Save, Upload, Eye, EyeOff, Key,
  Mail, Phone, MapPin, Calendar
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { 
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateLogoMutation,
  useUpdateFaviconMutation,
  fallbackSettings
} from '../../store/services/settingsApi';

const EnterpriseSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch settings data using RTK Query
  const { 
    data: settingsData = fallbackSettings, 
    isLoading, 
    error 
  } = useGetSettingsQuery();

  // Mutations
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [updateLogo, { isLoading: isUploadingLogo }] = useUpdateLogoMutation();
  const [updateFavicon, { isLoading: isUploadingFavicon }] = useUpdateFaviconMutation();

  // Local state for settings
  const [generalSettings, setGeneralSettings] = useState(fallbackSettings.general);
  const [brandingSettings, setBrandingSettings] = useState(fallbackSettings.branding);
  const [securitySettings, setSecuritySettings] = useState(fallbackSettings.security);
  const [notificationSettings, setNotificationSettings] = useState(fallbackSettings.notifications);

  // Update local state when API data is loaded
  useEffect(() => {
    if (settingsData) {
      setGeneralSettings(settingsData.general);
      setBrandingSettings(settingsData.branding);
      setSecuritySettings(settingsData.security);
      setNotificationSettings(settingsData.notifications);
    }
  }, [settingsData]);

  const handleSaveChanges = async () => {
    try {
      // Determine which section to update based on active tab
      let section: 'general' | 'branding' | 'security' | 'notifications';
      let data: any;
      
      switch (activeTab) {
        case 'general':
          section = 'general';
          data = generalSettings;
          break;
        case 'branding':
          section = 'branding';
          data = brandingSettings;
          break;
        case 'security':
          section = 'security';
          data = securitySettings;
          break;
        case 'notifications':
          section = 'notifications';
          data = notificationSettings;
          break;
        default:
          return; // Don't save if on billing tab
      }
      
      await updateSettings({ section, data }).unwrap();
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error(`Failed to save ${activeTab} settings:`, error);
      // Show error message
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('logo', file);
      
      try {
        const result = await updateLogo(formData).unwrap();
        setBrandingSettings(prev => ({ ...prev, logoUrl: result.logoUrl }));
        setHasChanges(true);
      } catch (error) {
        console.error('Failed to upload logo:', error);
        // Show error message
      }
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('favicon', file);
      
      try {
        const result = await updateFavicon(formData).unwrap();
        setBrandingSettings(prev => ({ ...prev, faviconUrl: result.faviconUrl }));
        setHasChanges(true);
      } catch (error) {
        console.error('Failed to upload favicon:', error);
        // Show error message
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton width={300} height={32} className="mb-2" />
            <Skeleton width={400} height={20} />
          </div>
          <Skeleton width={150} height={40} />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} width={120} height={40} className="rounded-md" />
          ))}
        </div>

        {/* Content Skeleton */}
        <Card className="p-6">
          <Skeleton width={200} height={28} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        </Card>
      </div>
    );
  }

  // Error state - use fallback data
  if (error) {
    console.error('Settings API error:', error);
    // Continue with fallback data, already set in the API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Institution Settings</h1>
          <p className="text-gray-600">Manage your institution's configuration and preferences</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600" disabled={isUpdating}>
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: Building2 },
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'users', label: 'User Management', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Institution Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
                <input
                  type="text"
                  value={generalSettings.institutionName}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, institutionName: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                <div className="flex">
                  <input
                    type="text"
                    value={generalSettings.subdomain}
                    onChange={(e) => {
                      setGeneralSettings({...generalSettings, subdomain: e.target.value});
                      setHasChanges(true);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                    .cbtgrinder.com
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={generalSettings.description}
                onChange={(e) => {
                  setGeneralSettings({...generalSettings, description: e.target.value});
                  setHasChanges(true);
                }}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={generalSettings.email}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, email: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={generalSettings.phone}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, phone: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={generalSettings.address}
                onChange={(e) => {
                  setGeneralSettings({...generalSettings, address: e.target.value});
                  setHasChanges(true);
                }}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={generalSettings.website}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, website: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                <input
                  type="number"
                  value={generalSettings.establishedYear}
                  onChange={(e) => {
                    setGeneralSettings({...generalSettings, establishedYear: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Branding Settings */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Brand Customization</h3>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Logo</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {brandingSettings.logoUrl ? (
                    <img src={brandingSettings.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="outline" as="span" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB. Recommended: 200x200px</p>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Color Scheme</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandingSettings.primaryColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, primaryColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-12 h-12 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={brandingSettings.primaryColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, primaryColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandingSettings.secondaryColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, secondaryColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-12 h-12 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={brandingSettings.secondaryColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, secondaryColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Accent Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandingSettings.accentColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, accentColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="w-12 h-12 rounded-lg border border-gray-300"
                    />
                    <input
                      type="text"
                      value={brandingSettings.accentColor}
                      onChange={(e) => {
                        setBrandingSettings({...brandingSettings, accentColor: e.target.value});
                        setHasChanges(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Font Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={brandingSettings.fontFamily}
                onChange={(e) => {
                  setBrandingSettings({...brandingSettings, fontFamily: e.target.value});
                  setHasChanges(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>

            {/* Custom CSS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
              <textarea
                value={brandingSettings.customCSS}
                onChange={(e) => {
                  setBrandingSettings({...brandingSettings, customCSS: e.target.value});
                  setHasChanges(true);
                }}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Security Configuration</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                </div>
                <button
                  onClick={() => {
                    setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth});
                    setHasChanges(true);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.twoFactorAuth ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => {
                    setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                <select
                  value={securitySettings.passwordPolicy}
                  onChange={(e) => {
                    setSecuritySettings({...securitySettings, passwordPolicy: e.target.value});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="basic">Basic (8+ characters)</option>
                  <option value="strong">Strong (8+ chars, mixed case, numbers)</option>
                  <option value="very-strong">Very Strong (12+ chars, mixed case, numbers, symbols)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
                <textarea
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => {
                    setSecuritySettings({...securitySettings, ipWhitelist: e.target.value});
                    setHasChanges(true);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter IP addresses, one per line (optional)"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-dark">Audit Logs</h4>
                  <p className="text-sm text-gray-600">Enable detailed audit logging</p>
                </div>
                <button
                  onClick={() => {
                    setSecuritySettings({...securitySettings, auditLogs: !securitySettings.auditLogs});
                    setHasChanges(true);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.auditLogs ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.auditLogs ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
                <input
                  type="number"
                  value={securitySettings.dataRetention}
                  onChange={(e) => {
                    setSecuritySettings({...securitySettings, dataRetention: parseInt(e.target.value)});
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance reports' },
                { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly analytics reports' },
                { key: 'systemAlerts', label: 'System Alerts', description: 'Receive system maintenance and security alerts' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-dark">{setting.label}</h4>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationSettings({
                        ...notificationSettings,
                        [setting.key]: !notificationSettings[setting.key as keyof typeof notificationSettings]
                      });
                      setHasChanges(true);
                    }}
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
          </Card>
        </div>
      )}

      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark mb-6">Billing Information</h3>
            
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold">{settingsData.billing.plan}</h4>
                  <p className="text-primary-100">Up to {settingsData.billing.usage.students.limit} students • All features included</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦{settingsData.billing.amount.toLocaleString()}</div>
                  <div className="text-primary-100">per month</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-dark mb-4">Current Usage</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-medium">{settingsData.billing.usage.students.current} / {settingsData.billing.usage.students.limit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staff Members</span>
                    <span className="font-medium">{settingsData.billing.usage.staff.current} / {settingsData.billing.usage.staff.limit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Used</span>
                    <span className="font-medium">{settingsData.billing.usage.storage.current} GB / {settingsData.billing.usage.storage.limit} GB</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-dark mb-4">Next Billing</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Payment</span>
                    <span className="font-medium">{settingsData.billing.nextPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">₦{settingsData.billing.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{settingsData.billing.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Billing History
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnterpriseSettings;