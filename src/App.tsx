import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EnterpriseLayout from './components/EnterpriseLayout';
import Enterprise from './pages/Enterprise/index';
import NotFound from './pages/NotFound';
import { OnboardingFlow } from './components/onboarding';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-light">
        {isFirstVisit && showOnboarding && (
          <OnboardingFlow
            isNewUser={true}
            onComplete={handleOnboardingComplete}
          />
        )}
        <Routes>
          {/* Auth routes without layout */}
          {/* Enterprise routes with dedicated enterprise layout */}
          <Route path="/*" element={<EnterpriseLayout><Enterprise /></EnterpriseLayout>} />
          
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;