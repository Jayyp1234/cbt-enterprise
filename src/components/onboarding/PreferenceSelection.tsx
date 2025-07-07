import React, { useState } from 'react';
import { X, CheckCircle, Bell, Moon, Zap, Globe, BookOpen, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface PreferenceSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  interests: string[];
  language: string;
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    interests: [],
    language: 'English',
  });

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms') => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleLanguageChange = (language: string) => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete(preferences);
  };

  const interests = [
    { id: 'student_management', label: 'Student Management', icon: '👥' },
    { id: 'fee_collection', label: 'Fee Collection', icon: '💰' },
    { id: 'staff_management', label: 'Staff Management', icon: '👨‍💼' },
    { id: 'performance_reports', label: 'Performance Reports', icon: '📊' },
    { id: 'study_materials', label: 'Study Materials', icon: '📚' },
    { id: 'ai_tutoring', label: 'AI Tutoring', icon: '🤖' },
    { id: 'bulk_messaging', label: 'Bulk Messaging', icon: '✉️' },
    { id: 'custom_branding', label: 'Custom Branding', icon: '🎨' },
  ];

  const languages = ['English', 'French', 'Yoruba', 'Igbo', 'Hausa', 'Arabic'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customize Your Experience</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            Set up your preferences to get the most out of CBT Grinder Enterprise
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Theme Preference */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Your Theme</h3>
              <p className="text-gray-600 mb-6">Select a theme that suits your preference.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="h-4 w-full bg-indigo-500 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="font-medium text-center">Light</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3">
                    <div className="h-4 w-full bg-indigo-500 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-gray-600 rounded"></div>
                  </div>
                  <div className="font-medium text-center">Dark</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme === 'system'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="h-4 w-full bg-indigo-500 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-gray-400 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-gray-400 rounded"></div>
                  </div>
                  <div className="font-medium text-center">System</div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Notification Preferences */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h3>
              <p className="text-gray-600 mb-6">Choose how you'd like to receive notifications.</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.email ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive in-app notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.push ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive text message alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('sms')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications.sms ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Interests</h3>
              <p className="text-gray-600 mb-6">Choose subjects that interest you for personalized content.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      preferences.interests.includes(interest.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{interest.icon}</div>
                    <div className="font-medium">{interest.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Language */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Language</h3>
              <p className="text-gray-600 mb-6">Choose your preferred language for the platform.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {languages.map((language) => (
                  <button
                    key={language}
                    onClick={() => handleLanguageChange(language)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.language === language
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{language}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={handleSkip}>
                Complete Later
              </Button>
              <Button onClick={handleNext}>
                {currentStep < totalSteps ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PreferenceSelection;