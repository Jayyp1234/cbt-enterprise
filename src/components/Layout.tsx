import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {isDesktop && <Sidebar />}
      
      {/* Top Bar for Mobile */}
      {!isDesktop && <TopBar />}
      
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
      
      {/* Bottom Navigation for Mobile */}
      {!isDesktop && <BottomNavigation />}
    </div>
  );
};

export default Layout;