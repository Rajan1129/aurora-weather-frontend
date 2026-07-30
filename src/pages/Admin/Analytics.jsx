// pages/Admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  Crown,
  Activity,
  Cloud,
  Brain,
  MapPin,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'; // ✅ Make sure MapPin is imported

export const AdminAnalytics = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch analytics data
      const [statsRes, weatherRes, aiRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getWeatherAnalytics(),
        adminApi.getAIAnalytics()
      ]);

      setAnalytics({
        stats: statsRes.data.data,
        weather: weatherRes.data.data,
        ai: aiRes.data.data
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Error Loading Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View detailed analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.stats?.users?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.stats?.users?.active || 0}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Premium Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.stats?.users?.premium || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-full">
              <Crown className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Conversations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.ai?.totalConversations || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-full">
              <Brain className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            User Growth
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            {/* Add your chart component here */}
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart will appear here</p>
              <p className="text-sm">(Chart.js or Recharts integration recommended)</p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            User Activity
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Activity chart will appear here</p>
              <p className="text-sm">(Chart.js or Recharts integration recommended)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Top Locations
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
              No location data available
            </div>
          </div>
        </div>

        {/* Time Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Peak Usage Times
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
              No usage data available
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
            No recent activity available
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;