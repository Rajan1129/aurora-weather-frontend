import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, Wind, Droplets, 
  Thermometer, Eye, Gauge, Compass,
  Calendar, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export function WeatherWidgets() {
  const { currentWeather, dailyForecast, hourlyForecast } = useWeather();

  const widgets = [
    {
      id: 'uv-index',
      title: 'UV Index',
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      value: currentWeather?.uvIndex || 'N/A',
      unit: '',
      color: 'from-yellow-500 to-orange-500',
      condition: (val) => {
        if (val > 7) return 'High';
        if (val > 4) return 'Moderate';
        return 'Low';
      }
    },
    {
      id: 'visibility',
      title: 'Visibility',
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      value: currentWeather?.visibility || 'N/A',
      unit: ' km',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pressure',
      title: 'Pressure',
      icon: <Gauge className="w-5 h-5 text-purple-500" />,
      value: currentWeather?.pressure || 'N/A',
      unit: ' hPa',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'wind-direction',
      title: 'Wind Direction',
      icon: <Compass className="w-5 h-5 text-green-500" />,
      value: currentWeather?.windDirection || 'N/A',
      unit: '°',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {widgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            {widget.icon}
          </div>
          <div className="text-sm text-gray-500">{widget.title}</div>
          <div className="text-xl font-bold">
            {widget.value}{widget.unit}
          </div>
          {widget.condition && widget.value !== 'N/A' && (
            <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 bg-gradient-to-r ${widget.color} text-white`}>
              {widget.condition(widget.value)}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}