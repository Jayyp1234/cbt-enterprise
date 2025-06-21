import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EnterpriseSidebar from './EnterpriseSidebar';
import EnterpriseTopBar from './EnterpriseTopBar';
import { useAuth } from '../hooks/useAuth';
import { useLogoutMutation } from '../store/services/authApi';

interface EnterpriseLayoutProps {
  children: ReactNode;
}

const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [logout] = useLogoutMutation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.startsWith('/auth')) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't render layout for auth pages
  if (location.pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {isDesktop && <EnterpriseSidebar onLogout={handleLogout} />}
      
      {/* Top Bar for Mobile */}
      {!isDesktop && <EnterpriseTopBar onLogout={handleLogout} />}
      
      {/* Main Content */}
      <div className={`${isDesktop ? 'ml-72' : ''} min-h-screen transition-all duration-300`}>
        {/* Content Area */}
        <main className={`${
          isDesktop ? 'p-8' : 'p-4 pb-24'
        } min-h-screen`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnterpriseLayout;