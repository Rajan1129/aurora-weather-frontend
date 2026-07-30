import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Brain, Settings, User, 
  Sparkles, Sun, Compass,
  X, MapPin, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWeather } from '../../context/WeatherContext';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/weather', icon: Sun, label: 'Weather' },
  { path: '/weather-map', icon: Compass, label: 'Radar Map' },
  { path: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const { selectedLocation } = useWeather();
  const isAdmin = user?.role === 'admin';

  // Determine if we should show the toggle button (only on mobile or when closed)
  const showToggle = !isOpen || window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full 
          bg-white/95 dark:bg-gray-900/95 
          backdrop-blur-xl
          border-r border-gray-200/50 dark:border-gray-800/50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-56 translate-x-0' : 'w-[60px] -translate-x-full lg:translate-x-0'}
          flex flex-col
          shadow-xl
        `}
      >
        {/* Logo with Hamburger Toggle */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200/50 dark:border-gray-800/50">
          <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {isOpen && (
              <span className="text-base font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent truncate">
                Aurora
              </span>
            )}
          </Link>
          
          {/* Toggle Button - Shows Menu when closed, X when open */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 text-sm
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                  ${!isOpen && 'justify-center'}
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${!isOpen && 'w-4 h-4'}`} />
                {isOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {isActive && (
                      <div className="w-1 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Location Display - Compact when open */}
          {isOpen && selectedLocation && (
            <>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
              <div className="px-2 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {selectedLocation.city || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
              <Link
                to="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200
                  ${!isOpen && 'justify-center'}
                `}
              >
                <Shield className={`w-4 h-4 flex-shrink-0 ${!isOpen && 'w-4 h-4'}`} />
                {isOpen && <span className="text-sm font-medium">Admin Panel</span>}
              </Link>
            </>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-2.5 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className={`flex items-center gap-2.5 ${!isOpen && 'justify-center'}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              {user?.firstName?.[0] || 'U'}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {user?.firstName || 'Guest'}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// Shield icon for admin
const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);