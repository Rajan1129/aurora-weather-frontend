import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, AlertOctagon, X, Bell, Cloud, CloudRain, Wind, Zap, Thermometer } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { toast } from 'react-hot-toast';

export function WeatherAlerts() {
  const { currentWeather, selectedLocation } = useWeather();
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    if (!currentWeather) return;

    const newAlerts = [];
    
    // Temperature alerts
    if (currentWeather.temperature > 35) {
      newAlerts.push({
        id: 'heatwave',
        type: 'warning',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Heatwave Alert',
        message: `Temperatures are reaching ${currentWeather.temperature}°C. Stay hydrated and avoid direct sunlight.`,
        severity: 'high',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    if (currentWeather.temperature < 0) {
      newAlerts.push({
        id: 'freeze',
        type: 'warning',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Freezing Alert',
        message: `Temperatures are below 0°C. Bundle up and be careful of ice.`,
        severity: 'high',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    // Wind alert
    if (currentWeather.windSpeed > 40) {
      newAlerts.push({
        id: 'highwind',
        type: 'warning',
        icon: <Wind className="w-5 h-5" />,
        title: 'High Wind Alert',
        message: `Wind speeds are ${currentWeather.windSpeed} km/h. Secure outdoor items and drive carefully.`,
        severity: 'medium',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    // Rain alert
    if (currentWeather.condition?.main?.toLowerCase().includes('rain')) {
      newAlerts.push({
        id: 'rain',
        type: 'info',
        icon: <CloudRain className="w-5 h-5" />,
        title: 'Rain Expected',
        message: 'Rain is expected. Don\'t forget to carry an umbrella!',
        severity: 'low',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    // Humidity alert
    if (currentWeather.humidity > 80) {
      newAlerts.push({
        id: 'humidity',
        type: 'info',
        icon: <Cloud className="w-5 h-5" />,
        title: 'High Humidity',
        message: `Humidity is ${currentWeather.humidity}%. It may feel sticky. Stay cool and hydrated.`,
        severity: 'low',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    // Storm alert
    if (currentWeather.condition?.main?.toLowerCase().includes('thunderstorm')) {
      newAlerts.push({
        id: 'storm',
        type: 'danger',
        icon: <Zap className="w-5 h-5" />,
        title: 'Storm Warning',
        message: 'Thunderstorms detected in your area. Stay indoors and avoid using electronics.',
        severity: 'critical',
        timestamp: new Date(),
        location: selectedLocation.city,
      });
    }

    setAlerts(newAlerts.filter(alert => !dismissedAlerts.includes(alert.id)));
  }, [currentWeather, selectedLocation, dismissedAlerts]);

  const dismissAlert = (id) => {
    setDismissedAlerts([...dismissedAlerts, id]);
    toast.success('Alert dismissed');
  };

  const getAlertColor = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
      case 'high': return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'low': return 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getAlertIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertOctagon className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <AlertCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-4 border-2 ${getAlertColor(alert.severity)} relative overflow-hidden`}
          >
            <button
              onClick={() => dismissAlert(alert.id)}
              className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <div className={`p-2 rounded-xl ${getAlertColor(alert.severity)}`}>
                {getAlertIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getAlertColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>{alert.location}</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}