import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, Wind, 
  Droplets, Thermometer, Eye, Gauge, Compass,
  Calendar, Clock, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, MapPin,
  Sunrise, Sunset, Moon, Star
} from 'lucide-react';
import { format } from 'date-fns';

export default function WeatherDetails() {
  const { 
    currentWeather, 
    hourlyForecast, 
    dailyForecast,
    loading,
    selectedLocation,
    fetchWeather 
  } = useWeather();

  const [activeTab, setActiveTab] = useState('hourly');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    fetchWeather(selectedLocation.lat, selectedLocation.lng);
  }, [selectedLocation]);

  // Get weather icon
  const getWeatherIcon = (icon) => {
    const icons = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌧️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return icons[icon] || '🌤️';
  };

  // Get temperature color
  const getTempColor = (temp) => {
    if (temp > 30) return 'text-red-500';
    if (temp > 25) return 'text-orange-500';
    if (temp > 20) return 'text-yellow-500';
    if (temp > 15) return 'text-green-500';
    if (temp > 10) return 'text-blue-400';
    if (temp > 5) return 'text-blue-500';
    return 'text-blue-600';
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return '--:--';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '--';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            {selectedLocation.city || 'Weather'}
          </h1>
          <p className="text-sm text-gray-500">
            {selectedLocation.country || ''} • {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchWeather(selectedLocation.lat, selectedLocation.lng)}
            className="glass-card px-4 py-2 text-sm hover:bg-white/20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-7xl animate-float">
                {getWeatherIcon(currentWeather.icon)}
              </div>
              <div>
                <div className="text-5xl font-bold">
                  {currentWeather.temperature}°C
                </div>
                <div className="text-gray-500">
                  Feels like {currentWeather.feelsLike}°C
                </div>
                <div className="text-lg font-medium">
                  {currentWeather.condition?.main}
                </div>
                <div className="text-sm text-gray-500">
                  {currentWeather.condition?.description}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 md:mt-0">
              <div className="text-center glass-card px-4 py-2">
                <div className="text-xs text-gray-500">Humidity</div>
                <div className="text-xl font-bold">{currentWeather.humidity}%</div>
              </div>
              <div className="text-center glass-card px-4 py-2">
                <div className="text-xs text-gray-500">Wind</div>
                <div className="text-xl font-bold">{currentWeather.windSpeed} km/h</div>
              </div>
              <div className="text-center glass-card px-4 py-2">
                <div className="text-xs text-gray-500">Pressure</div>
                <div className="text-xl font-bold">{currentWeather.pressure} hPa</div>
              </div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500">Visibility</div>
                <div className="font-medium">{currentWeather.visibility} km</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Clouds</div>
                <div className="font-medium">{currentWeather.clouds}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-500">UV Index</div>
                <div className="font-medium">{currentWeather.uvIndex || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-xs text-gray-500">Wind Direction</div>
                <div className="font-medium">{currentWeather.windDirection || 'N/A'}°</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('hourly')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'hourly'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Hourly
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'daily'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Daily
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'details'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sun className="w-4 h-4 inline mr-1" />
          Details
        </button>
      </div>

      {/* Hourly Forecast */}
      {activeTab === 'hourly' && hourlyForecast && hourlyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {hourlyForecast.slice(0, 24).map((hour, index) => {
                const temp = hour.temperature || hour.temp || 0;
                const icon = hour.icon || hour.weather?.[0]?.icon || '01d';
                const time = hour.time || (hour.dt ? new Date(hour.dt * 1000) : new Date());
                const rainProb = hour.rainProbability || hour.pop || 0;

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl min-w-[70px] ${
                      index === 0 ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs text-gray-500">
                      {index === 0 ? 'Now' : formatTime(time)}
                    </span>
                    <span className="text-2xl">{getWeatherIcon(icon)}</span>
                    <span className={`font-bold ${getTempColor(temp)}`}>
                      {Math.round(temp)}°
                    </span>
                    {rainProb > 0 && (
                      <span className="text-[10px] text-blue-500">{Math.round(rainProb * 100)}%</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Daily Forecast */}
      {activeTab === 'daily' && dailyForecast && dailyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <div className="space-y-3">
            {dailyForecast.slice(0, 7).map((day, index) => {
              const tempMin = day.tempMin || day.temperature_2m_min || 0;
              const tempMax = day.tempMax || day.temperature_2m_max || 0;
              const icon = day.icon || day.weather?.[0]?.icon || '01d';
              const date = day.date || new Date();
              const rainProb = day.rainProbability || day.pop || 0;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl ${
                    index === 0 ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-20">
                    <div className="font-medium">
                      {index === 0 ? 'Today' : formatDate(date)}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-4 justify-center">
                    <span className="text-2xl">{getWeatherIcon(icon)}</span>
                    <span className="text-sm text-gray-500">{day.condition?.main || 'Clear'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-orange-500" />
                      <span className="font-medium">{Math.round(tempMax)}°</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-blue-500" />
                      <span className="font-medium">{Math.round(tempMin)}°</span>
                    </div>
                    {rainProb > 0 && (
                      <span className="text-xs text-blue-500">{Math.round(rainProb * 100)}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && currentWeather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              Sun & Moon
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sunrise</span>
                <span className="font-medium">{formatTime(currentWeather.sunrise)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sunset</span>
                <span className="font-medium">{formatTime(currentWeather.sunset)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Moon Phase</span>
                <span className="font-medium">{currentWeather.moonPhase || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              Wind & Air
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Wind Speed</span>
                <span className="font-medium">{currentWeather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Wind Direction</span>
                <span className="font-medium">{currentWeather.windDirection || 'N/A'}°</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Humidity</span>
                <span className="font-medium">{currentWeather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pressure</span>
                <span className="font-medium">{currentWeather.pressure} hPa</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}