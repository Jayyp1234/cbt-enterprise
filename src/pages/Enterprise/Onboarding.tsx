import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '../../components/onboarding';
import { SubscriptionPlan } from '../../components/onboarding/SubscriptionFlow';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // In a real app, these would come from your auth/user state
  const isNewUser = true;
  const hasAcceptedTerms = false;
  const hasSetPreferences = false;
  const hasSubscription = false;
  const currentPlan: SubscriptionPlan | null = null;

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    // Redirect to dashboard after onboarding
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <OnboardingFlow
        isNewUser={isNewUser}
        hasAcceptedTerms={hasAcceptedTerms}
        hasSetPreferences={hasSetPreferences}
        hasSubscription={hasSubscription}
        currentPlan={currentPlan}
        onComplete={handleOnboardingComplete}
      />
      
      {/* This content will be shown if the user closes all modals without completing onboarding */}
      {!onboardingComplete && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CBT Grinder Enterprise Platform</h1>
            <p className="text-gray-600 mb-4">
              The all-in-one solution for managing your tutorial center or educational institution.
            </p>
            <p className="text-gray-600 mb-8">
              Complete your onboarding process to get started with:
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Student management</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Smart fee collection</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Staff management & payroll</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Digital study materials</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> AI-powered tutoring</li>
              </ul>
            </p>
            <button
              onClick={() => setShowTerms(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Onboarding
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;