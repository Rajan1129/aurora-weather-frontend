import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { 
  Clock, Sun, Cloud, CloudRain, CloudSnow, 
  Wind, Droplets, Thermometer, Eye, Gauge,
  ChevronLeft, ChevronRight, Play, Pause,
  Volume2, VolumeX, Maximize2, Minimize2,
  AlertCircle, Calendar, MapPin
} from 'lucide-react';

export function WeatherBroadcast() {
  const { hourlyForecast, currentWeather, selectedLocation } = useWeather();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const containerRef = useRef(null);

  // Get current hour to start from
  useEffect(() => {
    if (hourlyForecast && hourlyForecast.length > 0) {
      const now = new Date();
      const currentHour = now.getHours();
      const index = hourlyForecast.findIndex(h => {
        const hour = new Date(h.time).getHours();
        return hour >= currentHour;
      });
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [hourlyForecast]);

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying && hourlyForecast && hourlyForecast.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % hourlyForecast.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, hourlyForecast]);

  // Fullscreen handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-lg font-semibold">Weather Broadcast</h3>
        <p className="text-sm text-gray-500">No hourly data available</p>
      </div>
    );
  }

  const currentHour = hourlyForecast[currentIndex];
  if (!currentHour) return null;

  // Helper functions
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

  const getTempColor = (temp) => {
    if (temp > 30) return 'text-red-500';
    if (temp > 25) return 'text-orange-500';
    if (temp > 20) return 'text-yellow-500';
    if (temp > 15) return 'text-green-500';
    if (temp > 10) return 'text-blue-400';
    if (temp > 5) return 'text-blue-500';
    return 'text-blue-600';
  };

  const formatTime = (date) => {
    if (!date) return '--:--';
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getTimeOfDay = (date) => {
    if (!date) return 'Day';
    const hours = new Date(date).getHours();
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 17) return 'Afternoon';
    if (hours >= 17 && hours < 21) return 'Evening';
    return 'Night';
  };

  const getConditionEmoji = (main) => {
    const map = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
    };
    return map[main] || '🌤️';
  };

  const getFeeling = (temp) => {
    if (temp > 35) return '🔥 Very Hot';
    if (temp > 30) return '☀️ Hot';
    if (temp > 25) return '🌤️ Warm';
    if (temp > 20) return '🌿 Pleasant';
    if (temp > 15) return '🍂 Mild';
    if (temp > 10) return '🌧️ Cool';
    if (temp > 5) return '🧊 Cold';
    return '❄️ Freezing';
  };

  const getWeatherAdvice = (temp, condition, rainProb) => {
    if (temp > 30) return 'Stay hydrated and avoid direct sunlight';
    if (temp < 5) return 'Bundle up and stay warm';
    if (condition?.toLowerCase().includes('rain') && rainProb > 0.5) return 'Don\'t forget your umbrella';
    if (condition?.toLowerCase().includes('clear')) return 'Perfect day for outdoor activities';
    if (condition?.toLowerCase().includes('cloud')) return 'Great day for a walk';
    return 'Enjoy your day!';
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + hourlyForecast.length) % hourlyForecast.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % hourlyForecast.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Extract data with fallbacks
  const currentTemp = currentHour.temperature || currentHour.temp || 0;
  const currentCondition = currentHour.condition?.main || currentHour.weather?.[0]?.main || 'Clear';
  const currentIcon = currentHour.icon || currentHour.weather?.[0]?.icon || '01d';
  const windSpeed = currentHour.windSpeed || currentHour.wind_speed || 0;
  const rainProb = currentHour.rainProbability || currentHour.pop || 0;
  const humidity = currentHour.humidity || 0;
  const pressure = currentHour.pressure || 0;
  const feelsLike = currentHour.feelsLike || currentHour.feels_like || currentTemp;
  const time = currentHour.time || (currentHour.dt ? new Date(currentHour.dt * 1000).toISOString() : new Date());

  return (
    <div ref={containerRef} className="relative">
      <div className="glass-card p-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        {/* Broadcast Header */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Weather Broadcast</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLocation?.city || 'Live'} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-500 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Main Broadcast Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Weather Display */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-7xl animate-float">
                    {getWeatherIcon(currentIcon)}
                  </div>
                  <div>
                    <div className="text-4xl font-bold">
                      {Math.round(currentTemp)}°C
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentCondition}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {formatTime(time)}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 text-center">
                    <div className="text-xs text-gray-500">Feels Like</div>
                    <div className="text-lg font-bold">
                      {Math.round(feelsLike)}°C
                    </div>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <div className="text-xs text-gray-500">Condition</div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <span>{getConditionEmoji(currentCondition)}</span>
                      {currentCondition}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <p className="text-sm font-medium">
                    {getTimeOfDay(time)} Update: {currentCondition} with {Math.round(currentTemp)}°C
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Feeling: {getFeeling(currentTemp)} • Wind: {Math.round(windSpeed)} km/h
                  </p>
                  <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    💡 {getWeatherAdvice(currentTemp, currentCondition, rainProb)}
                  </p>
                </div>
              </div>

              {/* Right: Weather Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Wind className="w-4 h-4 text-blue-500" />
                    Wind
                  </div>
                  <div className="text-lg font-bold">{Math.round(windSpeed)} km/h</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Rain
                  </div>
                  <div className="text-lg font-bold">{Math.round(rainProb * 100)}%</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Cloud className="w-4 h-4 text-gray-500" />
                    Humidity
                  </div>
                  <div className="text-lg font-bold">{humidity}%</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Gauge className="w-4 h-4 text-purple-500" />
                    Pressure
                  </div>
                  <div className="text-lg font-bold">{pressure} hPa</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{hourlyForecast[0]?.time ? formatTime(hourlyForecast[0].time) : 'Start'}</span>
                <span>{hourlyForecast[hourlyForecast.length - 1]?.time ? formatTime(hourlyForecast[hourlyForecast.length - 1].time) : 'End'}</span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentIndex + 1) / hourlyForecast.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Previous hour"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Next hour"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {hourlyForecast.length}
            </span>
          </div>
        </div>

        {/* Hourly Thumbnails */}
        <div className="relative mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="flex gap-2 min-w-max">
            {hourlyForecast.slice(0, 24).map((hour, index) => {
              const isActive = index === currentIndex;
              const hourTemp = hour.temperature || hour.temp || 0;
              const hourIcon = hour.icon || hour.weather?.[0]?.icon || '01d';
              const hourTime = hour.time ? new Date(hour.time).getHours() : 0;
              const timeLabel = hourTime === 0 ? '12 AM' : 
                               hourTime < 12 ? `${hourTime} AM` :
                               hourTime === 12 ? '12 PM' : `${hourTime - 12} PM`;
              
              // Use unique key - either dt, id, or index
              const key = hour.dt || hour.id || `thumb-${index}`;

              return (
                <button
                  key={key}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    flex flex-col items-center p-2 rounded-lg min-w-[50px] transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                      : 'hover:bg-white/5'
                    }
                  `}
                  aria-label={`Go to ${timeLabel}`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                    {timeLabel}
                  </span>
                  <span className="text-xl">{getWeatherIcon(hourIcon)}</span>
                  <span className={`text-xs font-medium ${getTempColor(hourTemp)}`}>
                    {Math.round(hourTemp)}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherBroadcast;