import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { motion } from 'framer-motion';
import { 
  MapPin, Layers, ZoomIn, ZoomOut, RefreshCw, 
  Compass, Cloud, CloudRain, Wind, Thermometer,
  Navigation, Sun, Moon, Droplets
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Component to fly to location
function FlyToLocation({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 12, {
        duration: 2,
      });
    }
  }, [location, map]);
  
  return null;
}

// Component to generate weather points
function WeatherPoints({ data, activeLayer, centerLat, centerLng }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const newPoints = [];
    for (let i = 0; i < 40; i++) {
      const latOffset = (Math.random() - 0.5) * 4;
      const lngOffset = (Math.random() - 0.5) * 4;
      const value = Math.random() * 100;
      
      let color = '#3b82f6';
      let size = 8;
      
      if (activeLayer === 'temperature') {
        if (value > 70) { color = '#ef4444'; size = 14; }
        else if (value > 40) { color = '#f59e0b'; size = 11; }
        else { color = '#3b82f6'; size = 8; }
      } else if (activeLayer === 'precipitation') {
        if (value > 70) { color = '#1d4ed8'; size = 16; }
        else if (value > 40) { color = '#60a5fa'; size = 12; }
        else { color = '#93c5fd'; size = 8; }
      } else if (activeLayer === 'wind') {
        if (value > 70) { color = '#22c55e'; size = 14; }
        else if (value > 40) { color = '#4ade80'; size = 10; }
        else { color = '#86efac'; size = 7; }
      } else {
        if (value > 70) { color = '#64748b'; size = 14; }
        else if (value > 40) { color = '#94a3b8'; size = 10; }
        else { color = '#cbd5e1'; size = 7; }
      }
      
      newPoints.push({
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset,
        value: Math.round(value),
        color,
        size,
      });
    }
    setPoints(newPoints);
  }, [activeLayer, centerLat, centerLng]);

  return (
    <>
      {points.map((point, index) => (
        <Circle
          key={index}
          center={[point.lat, point.lng]}
          radius={point.size * 1000}
          pathOptions={{
            color: point.color,
            fillColor: point.color,
            fillOpacity: 0.6,
            weight: 0,
          }}
        />
      ))}
    </>
  );
}

export default function WeatherMap() {
  const { selectedLocation, currentWeather, fetchWeather } = useWeather();
  const [viewState, setViewState] = useState({
    center: [selectedLocation?.lat || 40.7128, selectedLocation?.lng || -74.006],
    zoom: 10,
  });
  const [activeLayer, setActiveLayer] = useState('temperature');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedLocation) {
      setViewState({
        center: [selectedLocation.lat, selectedLocation.lng],
        zoom: 11,
      });
    }
  }, [selectedLocation]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWeather(viewState.center[0], viewState.center[1]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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

  const layers = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'orange' },
    { id: 'precipitation', label: 'Precipitation', icon: CloudRain, color: 'blue' },
    { id: 'wind', label: 'Wind Speed', icon: Wind, color: 'green' },
    { id: 'clouds', label: 'Cloud Cover', icon: Cloud, color: 'gray' },
  ];

  const weatherIcon = currentWeather ? getWeatherIcon(currentWeather.icon) : '🌤️';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-500" />
            Weather Map
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {selectedLocation?.city || 'Your Location'} • Interactive weather layers
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-2 relative overflow-hidden"
      >
        <div className="w-full h-[500px] rounded-xl overflow-hidden relative">
          <MapContainer
            center={viewState.center}
            zoom={viewState.zoom}
            style={{ width: '100%', height: '100%' }}
            className="rounded-xl"
            zoomControl={false}
          >
            {/* OpenStreetMap Tiles (Free) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Stamen Terrain (Alternative) */}
            <TileLayer
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"
              opacity={0.5}
            />

            {/* Fly to location */}
            <FlyToLocation location={selectedLocation} />

            {/* Weather Points */}
            <WeatherPoints 
              data={null}
              activeLayer={activeLayer}
              centerLat={viewState.center[0]}
              centerLng={viewState.center[1]}
            />

            {/* Location Marker */}
            {selectedLocation && (
              <Marker 
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={createCustomIcon('#3b82f6')}
              >
                <Popup>
                  <div className="text-center p-2">
                    <div className="text-2xl">{weatherIcon}</div>
                    <div className="font-bold">{selectedLocation.city}</div>
                    <div className="text-sm text-gray-500">
                      {currentWeather?.temperature || '--'}°C • {currentWeather?.condition?.main || '--'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
              <button
                onClick={() => {
                  const map = mapRef.current;
                  if (map) map.setZoom(map.getZoom() + 1);
                }}
                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const map = mapRef.current;
                  if (map) map.setZoom(map.getZoom() - 1);
                }}
                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Location Info */}
            <div className="absolute top-4 left-4 glass-card px-4 py-2 z-[1000]">
              <div className="flex items-center gap-2">
                <div className="text-lg">{weatherIcon}</div>
                <div>
                  <div className="text-sm font-medium">{selectedLocation?.city || 'Your Location'}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{currentWeather?.temperature || '--'}°C</span>
                    <span>•</span>
                    <span>{currentWeather?.condition?.main || '--'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 z-[1000] bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded backdrop-blur">
              © OpenStreetMap contributors
            </div>
          </MapContainer>
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap gap-2 mt-4">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2
                  ${activeLayer === layer.id 
                    ? `bg-gradient-to-r from-${layer.color}-500 to-${layer.color}-600 text-white shadow-lg` 
                    : 'bg-white/10 hover:bg-white/20 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {layer.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-500" />
          Legend - {layers.find(l => l.id === activeLayer)?.label}
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-200 via-yellow-200 to-red-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Low → High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}