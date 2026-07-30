import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Running, Bike, Mountain, Dumbbell, TrendingUp } from 'lucide-react';

export function WorkoutAdvisor({ weatherData }) {
  const [loading, setLoading] = React.useState(false);
  const [workoutData, setWorkoutData] = React.useState(null);

  const getWorkoutAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      const temp = weatherData?.temperature || 20;
      const wind = weatherData?.windSpeed || 5;
      const condition = weatherData?.condition?.main?.toLowerCase() || 'clear';
      const isRaining = condition.includes('rain');

      const data = {
        indoor: {
          recommended: isRaining || temp > 35 || temp < 5,
          activities: ['Yoga', 'Weight Training', 'Pilates', 'Indoor Cycling'],
        },
        outdoor: {
          recommended: !isRaining && temp > 5 && temp < 30,
          score: Math.min(100, Math.max(0, 100 - (Math.abs(temp - 22) * 2) - (wind * 0.5))),
          activities: ['Running', 'Cycling', 'Hiking'],
          warnings: [],
        },
        running: {
          score: Math.min(100, Math.max(0, 100 - (Math.abs(temp - 18) * 3) - (wind * 0.3))),
          recommended: temp > 5 && temp < 25 && !isRaining,
          rating: temp > 15 && temp < 22 ? 'Excellent' : 'Good',
          bestTime: 'Morning',
        },
        cycling: {
          score: Math.min(100, Math.max(0, 100 - (Math.abs(temp - 20) * 2) - (wind * 0.5))),
          recommended: temp > 8 && temp < 30 && !isRaining && wind < 20,
          rating: wind < 10 && temp > 15 ? 'Excellent' : 'Good',
          bestTime: 'Morning',
        },
        hiking: {
          score: Math.min(100, Math.max(0, 100 - (Math.abs(temp - 18) * 2) - (wind * 0.2))),
          recommended: temp > 5 && temp < 28 && !isRaining,
          rating: 'Good',
          bestTime: 'Morning',
        },
      };

      setWorkoutData(data);
      setLoading(false);
    }, 800);
  };

  React.useEffect(() => {
    getWorkoutAdvice();
  }, [weatherData]);

  const activities = [
    { key: 'running', icon: Running, label: 'Running', color: 'from-blue-500 to-cyan-500' },
    { key: 'cycling', icon: Bike, label: 'Cycling', color: 'from-green-500 to-emerald-500' },
    { key: 'hiking', icon: Mountain, label: 'Hiking', color: 'from-orange-500 to-amber-500' },
    { key: 'indoor', icon: Dumbbell, label: 'Indoor', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">Workout Advisor</h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : workoutData ? (
        <>
          {/* Indoor/Outdoor recommendation */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`text-center p-3 rounded-lg ${workoutData.indoor.recommended ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5'}`}>
              <div className="text-sm text-gray-500">Indoor</div>
              <div className={`font-semibold ${workoutData.indoor.recommended ? 'text-blue-500' : 'text-gray-400'}`}>
                {workoutData.indoor.recommended ? '✅ Recommended' : '⏸️ Optional'}
              </div>
            </div>
            <div className={`text-center p-3 rounded-lg ${workoutData.outdoor.recommended ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'}`}>
              <div className="text-sm text-gray-500">Outdoor</div>
              <div className={`font-semibold ${workoutData.outdoor.recommended ? 'text-green-500' : 'text-gray-400'}`}>
                {workoutData.outdoor.recommended ? '✅ Recommended' : '⏸️ Optional'}
              </div>
            </div>
          </div>

          {/* Activity scores */}
          <div className="space-y-2">
            {activities.map((activity) => {
              const data = workoutData[activity.key];
              if (!data) return null;
              const Icon = activity.icon;
              const isRecommended = data.recommended !== undefined ? data.recommended : true;
              
              return (
                <div key={activity.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${activity.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.label}</div>
                    <div className="text-xs text-gray-500">
                      {data.score !== undefined ? `${Math.round(data.score)}%` : isRecommended ? '✅ Available' : '❌ Not ideal'}
                    </div>
                  </div>
                  {data.score !== undefined && (
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, data.score)}%` }}
                      />
                    </div>
                  )}
                  {data.rating && (
                    <span className="text-xs font-medium text-green-500">{data.rating}</span>
                  )}
                </div>
              );
            })}
          </div>

          {workoutData.outdoor.warnings?.length > 0 && (
            <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                {workoutData.outdoor.warnings[0]}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}