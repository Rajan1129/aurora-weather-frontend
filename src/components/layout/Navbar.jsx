import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Bell, User, Sun, Moon, 
  Sparkles, MapPin, X, Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useWeather } from '../../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from "../../config";

export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setSelectedLocation, fetchWeather, selectedLocation } = useWeather();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  // Notification state
  const [notifications, setNotifications] = useState([
    { id: 1, read: false, title: 'Weather Alert', message: 'Storm warning in your area' },
    { id: 2, read: false, title: 'Daily Summary', message: 'Check your daily weather summary' },
    { id: 3, read: true, title: 'AI Tip', message: 'New outfit recommendations available' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCities = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/cities/search`,
        { 
          params: { q: query },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setSearchResults(response.data.data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCitySelect = async (city) => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    
    setSelectedLocation({
      lat: city.lat,
      lng: city.lng,
      city: city.name,
      country: city.country,
    });
    
    await fetchWeather(city.lat, city.lng);
    toast.success(`Weather updated for ${city.displayName || city.name}`);
    
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/weather?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
    toast.success('Notifications cleared');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Menu & Brand */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Aurora
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
              <MapPin className="w-3 h-3" />
              <span className="font-medium truncate max-w-[120px]">
                {selectedLocation?.city || 'Select Location'}
              </span>
            </div>
          </div>

          {/* Center - Search (Expands on mobile with max-lg:flex-1) */}
          <div className="flex-1 max-lg:flex-1 max-w-xl mx-2 md:mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-full px-4 py-2 pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <Loader className="absolute right-3 top-2.5 w-4 h-4 text-blue-500 animate-spin" />
              )}

              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-80 overflow-y-auto z-50"
                  >
                    {searchResults.map((city, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{city.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {city.state ? `${city.state}, ` : ''}{city.country}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{city.country}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 text-center z-50"
                >
                  <p className="text-sm text-gray-500">No cities found. Try a different search.</p>
                </motion.div>
              )}
            </form>
          </div>

          {/* Right - Icons (Logout removed entirely here) */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {/* [Notification content stays exactly the same] */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-sm">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:text-blue-600 transition-colors">Mark all read</button>
                        )}
                        <button onClick={clearNotifications} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear all</button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">🔔</div>
                          <p className="text-sm text-gray-500">No notifications</p>
                          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} onClick={() => markAsRead(notification.id)} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''} border-b border-gray-100 dark:border-gray-800 last:border-0`}>
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{new Date().toLocaleTimeString()}</p>
                              </div>
                              {!notification.read && (<div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs text-blue-500 hover:text-blue-600 transition-colors block text-center">View all notifications</Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user?.firstName || 'Guest'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}