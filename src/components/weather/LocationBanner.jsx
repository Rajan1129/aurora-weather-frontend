import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, RefreshCw } from 'lucide-react';
import { getCurrentLocationData, saveLocation } from '../../services/locationService';
import { useWeather } from '../../context/WeatherContext';
import { toast } from 'react-hot-toast';

export function LocationBanner() {
  const { setSelectedLocation, fetchWeather } = useWeather();
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('locationPermissionHandled');
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const locationData = await getCurrentLocationData();
      
      saveLocation({
        ...locationData,
        timestamp: Date.now(),
      });
      
      setSelectedLocation({
        lat: locationData.lat,
        lng: locationData.lng,
        city: locationData.city,
        country: locationData.country,
      });
      
      await fetchWeather(locationData.lat, locationData.lng);
      
      toast.success(`📍 Location set to ${locationData.city}`);
      setIsVisible(false);
      localStorage.setItem('locationPermissionHandled', 'true');
    } catch (error) {
      toast.error(error.message || 'Unable to get location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('locationPermissionHandled', 'true');
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-4 mb-4 border border-blue-500/30 bg-blue-500/5"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium">
            📍 Enable Location Services
          </p>
          <p className="text-xs text-gray-500">
            Allow Aurora to detect your location for accurate weather updates
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'Allow'
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}