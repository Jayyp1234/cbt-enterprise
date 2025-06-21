import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PenTool, BookOpen, MessageCircle, User, Plus } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: PenTool, label: 'Practice', path: '/practice' },
    { icon: BookOpen, label: 'Study', path: '/study' },
    { icon: MessageCircle, label: 'AI Tutor', path: '/ai-tutor' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 lg:hidden">
      {/* Floating Action Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => navigate('/exam')}
          className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 min-w-0 flex-1 transition-all duration-200 ${
                index === 2 ? 'opacity-0 pointer-events-none' : '' // Hide middle item for FAB space
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-primary-500 shadow-lg shadow-primary-500/25 scale-110' 
                  : 'hover:bg-gray-100'
              }`}>
                <item.icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active ? 'text-white' : 'text-gray-500'
                  }`} 
                />
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                active ? 'text-primary-500' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-primary-500 rounded-full mt-1 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </div>
  );
};

export default BottomNavigation;