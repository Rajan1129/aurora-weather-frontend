import React, { useEffect, useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Thermometer, Wind, Droplets, Sun, 
  Sparkles, Heart, Activity, MapPin,
  Cloud, CloudRain, CloudSnow, 
  Moon, Star, TrendingUp, Calendar,
  Clock, Eye, Gauge, Compass,
  ArrowUp, ArrowDown, RefreshCw,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../api/auth';
import { toast } from 'react-hot-toast';
import { WeatherAlerts } from '../../components/weather/WeatherAlerts';
import { WeatherWidgets } from '../../components/weather/WeatherWidgets';
import { ShareWeather } from '../../components/weather/ShareWeather';
import HourlyForecast from '../../components/weather/HourlyForecast';
import { WeatherBroadcast } from '../../components/weather/WeatherBroadcast';
import { LocationBanner } from '../../components/weather/LocationBanner';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    currentWeather, 
    hourlyForecast,
    dailyForecast,
    loading,
    selectedLocation,
    fetchWeather 
  } = useWeather();

  const [aiSummary, setAiSummary] = useState(null);
  const [aiMood, setAiMood] = useState(null);
  const [aiImpact, setAiImpact] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchWeather(selectedLocation.lat, selectedLocation.lng);
      
      setIsLoadingAI(true);
      try {
        const [summary, mood, impact] = await Promise.all([
          aiApi.getDailySummary(selectedLocation.lat, selectedLocation.lng),
          aiApi.getMoodForecast(),
          aiApi.getImpactScore(selectedLocation.lat, selectedLocation.lng),
        ]);
        setAiSummary(summary.data.data);
        setAiMood(mood.data.data);
        setAiImpact(impact.data.data);
      } catch (error) {
        console.error('AI data fetch error:', error);
      } finally {
        setIsLoadingAI(false);
      }
    };
    loadData();
  }, [selectedLocation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeather(selectedLocation.lat, selectedLocation.lng);
    setRefreshing(false);
    toast.success('Weather updated!');
  };

  const getWeatherIcon = (icon) => {
    const icons = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌧️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    return icons[icon] || '🌤️';
  };

  const getTimeOfDay = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 5 && hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 17) {
      return 'Afternoon';
    } else if (hours >= 17 && hours < 21) {
      return 'Evening';
    } else {
      return 'Night';
    }
  };

  const getGreetingEmoji = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 5 && hours < 12) return '🌅';
    if (hours >= 12 && hours < 17) return '☀️';
    if (hours >= 17 && hours < 21) return '🌅';
    return '🌙';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your weather...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <LocationBanner />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getGreetingEmoji()}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              Good {getTimeOfDay()}, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{user?.firstName || 'Guest'}</span>!
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            {selectedLocation.city || 'Your Location'}
            <span className="text-xs text-gray-400">• {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </motion.button>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm font-medium">AI Ready</span>
          </div>
          <Link to="/premium" className="glass-card px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium hidden sm:inline">Upgrade</span>
          </Link>
        </div>
      </motion.div>

      {/* Current Weather Card */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-7xl md:text-8xl animate-float">
                  {getWeatherIcon(currentWeather.icon)}
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold">
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Feels like {currentWeather.feelsLike}°C
                  </div>
                  <div className="text-lg font-medium mt-1 flex items-center gap-2">
                    {currentWeather.condition?.main}
                    <span className="text-sm font-normal text-gray-500">{currentWeather.condition?.description}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                <div className="glass-card px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Humidity
                  </div>
                  <div className="text-xl font-bold">{currentWeather.humidity}%</div>
                </div>
                <div className="glass-card px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Wind className="w-4 h-4 text-blue-500" />
                    Wind
                  </div>
                  <div className="text-xl font-bold">{currentWeather.windSpeed} km/h</div>
                </div>
                <div className="glass-card px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Gauge className="w-4 h-4 text-purple-500" />
                    Pressure
                  </div>
                  <div className="text-xl font-bold">{currentWeather.pressure} hPa</div>
                </div>
                <div className="glass-card px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4 text-green-500" />
                    Visibility
                  </div>
                  <div className="text-xl font-bold">{currentWeather.visibility} km</div>
                </div>
              </div>
            </div>

            {/* View Radar Button */}
            <div className="mt-4 flex justify-end">
              <Link 
                to="/weather-map" 
                className="glass-card px-4 py-2 inline-flex items-center gap-2 hover:bg-white/20 transition-colors text-sm group"
              >
                <Compass className="w-4 h-4 text-blue-500 group-hover:rotate-45 transition-transform" />
                <span>View Radar</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 hover:scale-[1.02] transition-transform cursor-pointer group"
          onClick={() => window.location.href = '/ai-assistant'}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">AI Daily Summary</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {isLoadingAI ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ) : aiSummary ? (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiSummary.message}
              </p>
              <div className="mt-3 space-y-1">
                {aiSummary.recommendations?.slice(0, 2).map((rec, i) => (
                  <div key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <span className="text-blue-500">•</span> {rec}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 hover:scale-[1.02] transition-transform cursor-pointer group"
          onClick={() => window.location.href = '/ai-assistant'}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <h3 className="font-semibold">Mood Forecast</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {isLoadingAI ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ) : aiMood ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold capitalize">{aiMood.mood}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Energy: {aiMood.energyLevel}%
                  </div>
                </div>
                <div className="text-4xl">
                  {aiMood.mood === 'happy' ? '😊' :
                   aiMood.mood === 'calm' ? '😌' :
                   aiMood.mood === 'energetic' ? '⚡' :
                   aiMood.mood === 'focused' ? '🎯' :
                   aiMood.mood === 'cozy' ? '🛋️' : '😌'}
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Productivity</span>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                      style={{ width: `${aiMood.productivityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{aiMood.productivityScore}%</span>
                </div>
              </div>
            </>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 hover:scale-[1.02] transition-transform cursor-pointer group"
          onClick={() => window.location.href = '/ai-assistant'}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Impact Score</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {isLoadingAI ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : aiImpact ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-500">{aiImpact.overall}%</div>
                  <div className="text-xs text-gray-500">Overall Impact</div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                      className="dark:stroke-gray-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#22c55e"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${aiImpact.overall * 1.76} ${280 - aiImpact.overall * 1.76}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {aiImpact.overall}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                <div className="text-xs">
                  <span className="text-gray-500">Productivity</span>
                  <div className="font-semibold">{aiImpact.productivity}%</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Travel</span>
                  <div className="font-semibold">{aiImpact.travel}%</div>
                </div>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      {/* 5-Day Forecast */}
      {dailyForecast && dailyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              5-Day Forecast
            </h3>
            <Link to="/weather" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {dailyForecast.slice(0, 5).map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="text-sm font-medium">
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-3xl my-2">{getWeatherIcon(day.icon)}</div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="font-semibold text-orange-500">{day.tempMax}°</span>
                  <span className="text-gray-400">/</span>
                  <span className="font-semibold text-blue-500">{day.tempMin}°</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3" />
                  {day.rainProbability}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {hourlyForecast && hourlyForecast.length > 0 && (
  <div className="mt-6">
    <HourlyForecast 
      hourly={hourlyForecast} 
      units="metric"
      showDetails={true}
      maxItems={24}
      title="Hourly Forecast"
    />
  </div>
)}

<div className="mt-6">
  <WeatherBroadcast />
</div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '👕', label: 'Outfit AI', path: '/ai-assistant', color: 'from-blue-500 to-cyan-500' },
          { icon: '🧘', label: 'Mood Forecast', path: '/ai-assistant', color: 'from-pink-500 to-rose-500' },
          { icon: '🏃', label: 'Workout AI', path: '/ai-assistant', color: 'from-green-500 to-emerald-500' },
          { icon: '🐕', label: 'Pet Advisor', path: '/ai-assistant', color: 'from-orange-500 to-amber-500' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition-transform group"
            onClick={() => window.location.href = item.path}
          >
            <div className="text-3xl mb-1">{item.icon}</div>
            <div className="text-sm font-medium">{item.label}</div>
            <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r ${item.color} mx-auto mt-1`} />
          </motion.div>
        ))}
      </div>

      {/* Weather Alert Banner */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/5"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
              <span className="font-medium">AI Tip:</span> Based on today's weather ({currentWeather.condition?.main}), 
              {currentWeather.temperature > 30 ? ' it\'s quite hot. Stay hydrated and avoid direct sunlight!' :
               currentWeather.temperature < 10 ? ' it\'s cold today. Bundle up and stay warm!' :
               currentWeather.condition?.main === 'Rain' ? ' don\'t forget your umbrella!' :
               ' it\'s a great day for outdoor activities!'}
            </p>
            <button className="text-xs text-yellow-500 hover:text-yellow-600 font-medium">
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}