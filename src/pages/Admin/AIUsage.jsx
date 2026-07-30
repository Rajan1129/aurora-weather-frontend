import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Activity, TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';

export function AdminAIUsage() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    dailyRequests: 0,
    uniqueUsers: 0,
    avgResponseTime: 0,
    cost: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalRequests: 8912,
        dailyRequests: 345,
        uniqueUsers: 234,
        avgResponseTime: 1.2,
        cost: 45.67,
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Usage</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor AI feature usage and costs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Requests</div>
              <div className="text-xl font-bold">{stats.totalRequests}</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Daily Requests</div>
              <div className="text-xl font-bold">{stats.dailyRequests}</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Unique Users</div>
              <div className="text-xl font-bold">{stats.uniqueUsers}</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Response</div>
              <div className="text-xl font-bold">{stats.avgResponseTime}s</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Brain className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Cost</div>
              <div className="text-xl font-bold">${stats.cost}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">AI Feature Usage Breakdown</h3>
        <div className="space-y-3">
          {[
            { name: 'Weather Predictions', usage: 35, color: 'from-blue-500 to-cyan-500' },
            { name: 'Outfit Recommendations', usage: 25, color: 'from-purple-500 to-pink-500' },
            { name: 'Mood Forecasts', usage: 20, color: 'from-green-500 to-emerald-500' },
            { name: 'Photo Analysis', usage: 12, color: 'from-yellow-500 to-orange-500' },
            { name: 'Weather Stories', usage: 8, color: 'from-red-500 to-rose-500' },
          ].map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.usage}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.usage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}