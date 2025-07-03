import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ isOpen, onClose, onAccept }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (!acceptTerms || !acceptPrivacy) {
      setError('Please accept both the Terms of Service and Privacy Policy to continue.');
      return;
    }
    
    setError(null);
    onAccept();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Welcome to CBT Grinder Enterprise</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            Please review and accept our Terms and Privacy Policy to continue
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Terms of Service */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Terms of Service</h3>
            <div className="h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-sm text-gray-700">
              <h4 className="font-medium text-gray-900 mb-2">1. Acceptance of Terms</h4>
              <p className="mb-4">
                By accessing or using CBT Grinder Enterprise services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">2. Description of Service</h4>
              <p className="mb-4">
                CBT Grinder Enterprise provides a digital learning platform for tutorial centers and educational institutions to manage students, staff, exams, and payments.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">3. User Accounts</h4>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">4. Subscription and Payments</h4>
              <p className="mb-4">
                Subscription fees are charged on a monthly or annual basis. Payment is due at the beginning of each billing period. Refunds are provided in accordance with our refund policy.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">5. Content and Intellectual Property</h4>
              <p className="mb-4">
                All content provided through our services is owned by CBT Grinder or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">6. Termination</h4>
              <p className="mb-4">
                We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason at our discretion.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">7. Limitation of Liability</h4>
              <p className="mb-4">
                CBT Grinder shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">8. Changes to Terms</h4>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on our website or through the service.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">9. Governing Law</h4>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
              </p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <span className="text-indigo-600 font-medium">Terms of Service</span>
              </span>
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Privacy Policy</h3>
            <div className="h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-sm text-gray-700">
              <h4 className="font-medium text-gray-900 mb-2">1. Information We Collect</h4>
              <p className="mb-4">
                We collect personal information such as name, email address, phone number, and payment information when you register for our services. We also collect usage data to improve our services.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">2. How We Use Your Information</h4>
              <p className="mb-4">
                We use your information to provide and improve our services, process payments, send notifications, and communicate with you about your account and our services.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">3. Data Security</h4>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">4. Data Sharing</h4>
              <p className="mb-4">
                We do not sell your personal information to third parties. We may share your information with service providers who help us deliver our services, but they are obligated to maintain the confidentiality of your information.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">5. Student Data</h4>
              <p className="mb-4">
                Educational institutions using our platform are responsible for obtaining appropriate consent for the collection and use of student data in accordance with applicable laws.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">6. Cookies and Tracking</h4>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve user experience.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">7. Your Rights</h4>
              <p className="mb-4">
                You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your information.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">8. Changes to Privacy Policy</h4>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website or through the service.
              </p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={() => setAcceptPrivacy(!acceptPrivacy)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <span className="text-indigo-600 font-medium">Privacy Policy</span>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Decline
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={!acceptTerms || !acceptPrivacy}
              className={!acceptTerms || !acceptPrivacy ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;