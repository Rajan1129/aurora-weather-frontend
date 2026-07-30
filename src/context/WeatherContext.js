import React, { createContext, useState, useContext, useEffect } from 'react';
import { weatherApi } from '../api/auth';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WeatherContext = createContext(null);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
};

export function WeatherProvider({ children }) {
  const { isAuthenticated, userLocation } = useAuth();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          lat: parsed.lat || 40.7128,
          lng: parsed.lng || -74.0060,
          city: parsed.city || 'New York',
          country: parsed.country || 'US',
        };
      } catch {
        // Fallback to default
      }
    }
    return { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'US' };
  });

  useEffect(() => {
    if (userLocation && isAuthenticated) {
      setSelectedLocation({
        lat: userLocation.lat || 40.7128,
        lng: userLocation.lng || -74.0060,
        city: userLocation.city || 'Your Location',
        country: userLocation.country || '',
      });
    }
  }, [userLocation, isAuthenticated]);

  const fetchWeather = async (lat, lng) => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {

      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [current, hourly, daily, air] = await Promise.all([
        weatherApi.getCurrentWeather(lat, lng),
        weatherApi.getHourlyForecast(lat, lng),
        weatherApi.getDailyForecast(lat, lng),
        weatherApi.getAirQuality(lat, lng),
      ]);

      setCurrentWeather(current.data.data);
      setHourlyForecast(hourly.data.data || []);
      setDailyForecast(daily.data.data || []);
      setAirQuality(air.data.data);
      
      return {
        current: current.data.data,
        hourly: hourly.data.data,
        daily: daily.data.data,
        airQuality: air.data.data,
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Don't show toast for 401 errors (handled by interceptor)
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch weather data');
      }
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Only fetch weather when authenticated and location changes
  useEffect(() => {
    if (isAuthenticated && selectedLocation) {
      fetchWeather(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation, isAuthenticated]);

  const updateLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const value = {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    airQuality,
    loading,
    error,
    selectedLocation,
    setSelectedLocation: updateLocation,
    fetchWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}
