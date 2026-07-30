import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';

export function AdminWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWeatherData([
        { id: 1, city: 'New York', temp: 22, condition: 'Clear', humidity: 65, wind: 12, timestamp: '2024-01-15 14:30' },
        { id: 2, city: 'London', temp: 15, condition: 'Cloudy', humidity: 78, wind: 18, timestamp: '2024-01-15 14:30' },
        { id: 3, city: 'Tokyo', temp: 28, condition: 'Sunny', humidity: 45, wind: 8, timestamp: '2024-01-15 14:30' },
        { id: 4, city: 'Paris', temp: 18, condition: 'Rainy', humidity: 82, wind: 15, timestamp: '2024-01-15 14:30' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': <Sun className="w-5 h-5 text-yellow-500" />,
      'Cloudy': <Cloud className="w-5 h-5 text-gray-500" />,
      'Rainy': <CloudRain className="w-5 h-5 text-blue-500" />,
      'Sunny': <Sun className="w-5 h-5 text-orange-500" />,
    };
    return icons[condition] || <Cloud className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weather Data</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor weather data across locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-sm text-gray-500">Total Locations</div>
          <div className="text-xl font-bold">156</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm text-gray-500">Avg Temperature</div>
          <div className="text-xl font-bold">22.4°C</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-2">🌧️</div>
          <div className="text-sm text-gray-500">Rain Chance</div>
          <div className="text-xl font-bold">34%</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl mb-2">💨</div>
          <div className="text-sm text-gray-500">Avg Wind Speed</div>
          <div className="text-xl font-bold">14.2 km/h</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {weatherData.map((data) => (
                <tr key={data.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{data.city}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(data.condition)}
                      {data.condition}
                    </div>
                  </td>
                  <td className="px-6 py-4">{data.temp}°C</td>
                  <td className="px-6 py-4">{data.humidity}%</td>
                  <td className="px-6 py-4">{data.wind} km/h</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{data.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}