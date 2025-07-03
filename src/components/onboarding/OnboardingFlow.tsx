import React, { useState, useEffect } from 'react';
import TermsAndConditions from './TermsAndConditions';
import PreferenceSelection, { UserPreferences } from './PreferenceSelection';
import SubscriptionFlow, { SubscriptionPlan } from './SubscriptionFlow';

interface OnboardingFlowProps {
  isNewUser?: boolean;
  hasAcceptedTerms?: boolean;
  hasSetPreferences?: boolean;
  hasSubscription?: boolean;
  currentPlan?: SubscriptionPlan | null;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isNewUser = true,
  hasAcceptedTerms = false,
  hasSetPreferences = false,
  hasSubscription = false,
  currentPlan = null,
  onComplete
}) => {
  const [showTerms, setShowTerms] = useState(isNewUser && !hasAcceptedTerms);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [userSubscription, setUserSubscription] = useState<SubscriptionPlan | null>(currentPlan);

  useEffect(() => {
    // Determine which screen to show first based on user's progress
    if (isNewUser) {
      if (!hasAcceptedTerms) {
        setShowTerms(true);
      } else if (!hasSetPreferences) {
        setShowPreferences(true);
      } else if (!hasSubscription) {
        setShowSubscription(true);
      }
    }
  }, [isNewUser, hasAcceptedTerms, hasSetPreferences, hasSubscription]);

  const handleTermsAccepted = () => {
    setShowTerms(false);
    setShowPreferences(true);
    
    // In a real app, you would save this to the user's profile
    console.log('Terms and conditions accepted');
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    setShowPreferences(false);
    setUserPreferences(preferences);
    setShowSubscription(true);
    
    // In a real app, you would save preferences to the user's profile
    console.log('User preferences set:', preferences);
  };

  const handleSubscriptionComplete = (plan: SubscriptionPlan) => {
    setShowSubscription(false);
    setUserSubscription(plan);
    
    // In a real app, you would process the subscription
    console.log('Subscription selected:', plan);
    
    // Complete the onboarding process
    onComplete();
  };

  return (
    <>
      <TermsAndConditions 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        onAccept={handleTermsAccepted} 
      />
      
      <PreferenceSelection 
        isOpen={showPreferences} 
        onClose={() => setShowPreferences(false)} 
        onComplete={handlePreferencesComplete} 
      />
      
      <SubscriptionFlow 
        isOpen={showSubscription} 
        onClose={() => setShowSubscription(false)} 
        onSubscribe={handleSubscriptionComplete}
        currentPlan={userSubscription}
      />
    </>
  );
};

export default OnboardingFlow;