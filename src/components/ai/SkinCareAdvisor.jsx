import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Droplets, Wind, Shield, Sparkles } from 'lucide-react';

export function SkinCareAdvisor({ weatherData, airQualityData }) {
  const [loading, setLoading] = React.useState(false);
  const [advice, setAdvice] = React.useState(null);

  const getSkinAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      const uv = weatherData?.uvIndex || 5;
      const humidity = weatherData?.humidity || 60;
      const pollution = airQualityData?.aqi || 2;
      const temp = weatherData?.temperature || 20;

      let uvRisk = 'Moderate';
      let spf = 30;
      if (uv > 7) { uvRisk = 'High'; spf = 50; }
      else if (uv > 4) { uvRisk = 'Moderate'; spf = 30; }
      else { uvRisk = 'Low'; spf = 15; }

      let moisturizerType = 'Light';
      let hydrationLevel = 'Normal';
      if (humidity < 30) { moisturizerType = 'Heavy'; hydrationLevel = 'Low'; }
      else if (humidity < 50) { moisturizerType = 'Medium'; hydrationLevel = 'Normal'; }
      else { moisturizerType = 'Light'; hydrationLevel = 'High'; }

      const data = {
        uvRisk,
        spf,
        sunscreen: {
          spf,
          type: 'Broad spectrum',
          applicationTime: uv > 4 ? 'Every 2 hours' : 'Once in the morning',
        },
        moisturizer: {
          recommended: true,
          type: moisturizerType,
          reason: `${humidity}% humidity - ${moisturizerType} moisturizer recommended`,
        },
        hydration: {
          level: hydrationLevel,
          recommendation: hydrationLevel === 'Low' ? 'Drink 10+ glasses of water' :
                         hydrationLevel === 'Normal' ? 'Drink 8 glasses of water' :
                         'Drink 6-8 glasses of water',
        },
        pollution: {
          level: pollution > 3 ? 'High' : pollution > 2 ? 'Moderate' : 'Low',
          recommendation: pollution > 2 ? 'Use antioxidant serum' : 'Regular cleansing',
        },
      };

      setAdvice(data);
      setLoading(false);
    }, 800);
  };

  React.useEffect(() => {
    getSkinAdvice();
  }, [weatherData, airQualityData]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">Skin Care Advisor</h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : advice ? (
        <div className="space-y-3">
          {/* UV Risk */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">UV Risk</span>
            </div>
            <span className={`font-semibold ${
              advice.uvRisk === 'High' ? 'text-red-500' :
              advice.uvRisk === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {advice.uvRisk}
            </span>
          </div>

          {/* Sunscreen */}
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Sunscreen</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              SPF {advice.sunscreen.spf} • {advice.sunscreen.type}
            </div>
            <div className="text-xs text-gray-500">Apply: {advice.sunscreen.applicationTime}</div>
          </div>

          {/* Moisturizer */}
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Moisturizer</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {advice.moisturizer.type} moisturizer recommended
            </div>
            <div className="text-xs text-gray-500">{advice.moisturizer.reason}</div>
          </div>

          {/* Hydration */}
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium">Hydration</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level: {advice.hydration.level}
            </div>
            <div className="text-xs text-gray-500">{advice.hydration.recommendation}</div>
          </div>

          {/* Pollution */}
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Pollution</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level: {advice.pollution.level}
            </div>
            <div className="text-xs text-gray-500">{advice.pollution.recommendation}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}