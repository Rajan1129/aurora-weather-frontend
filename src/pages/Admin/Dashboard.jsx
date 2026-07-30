// pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import {
  Users,
  UserCheck,
  Crown,
  Brain,
  Cloud,
  Activity,
  Server,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  UserPlus
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth(); // Remove token from here
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);


      // Don't pass token - interceptor handles it
      const response = await adminApi.getStats();
      

      
      if (response.data.success) {
        const data = response.data.data;
        setStats(data);
        setRecentUsers(data.recentUsers || []);
      }
    } catch (err) {
      console.error('❌ Error fetching admin stats:', err);
      console.error('❌ Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName || 'Admin'}! Here's what's happening with your app.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.users?.total || 0}
          icon={Users}
          color="bg-blue-500"
          trend={stats.users?.growth || 0}
        />
        <StatCard
          title="Active Users"
          value={stats.users?.active || 0}
          icon={UserCheck}
          color="bg-green-500"
          subtitle={`${stats.users?.newUsers || 0} new this week`}
        />
        <StatCard
          title="Premium Users"
          value={stats.users?.premium || 0}
          icon={Crown}
          color="bg-purple-500"
        />
        <StatCard
          title="AI Conversations"
          value={stats.ai?.totalConversations || 0}
          icon={Brain}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Weather Records"
          value={stats.weather?.totalRecords || 0}
          icon={Cloud}
          color="bg-cyan-500"
        />
        <StatCard
          title="Active Sessions"
          value={stats.system?.activeSessions || 0}
          icon={Activity}
          color="bg-indigo-500"
        />
        <StatCard
          title="Guest Users"
          value={stats.users?.guests || 0}
          icon={UserPlus}
          color="bg-gray-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          System Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Database</p>
            <p className={`font-semibold ${stats.systemHealth?.database === 'Connected' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.systemHealth?.database || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weather API</p>
            <p className={`font-semibold ${stats.systemHealth?.weatherApi === 'Configured' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.systemHealth?.weatherApi || 'Not Configured'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {Math.floor(stats.systemHealth?.uptime / 60 / 60)}h {Math.floor((stats.systemHealth?.uptime / 60) % 60)}m
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Environment</p>
            <p className="font-semibold text-gray-900 dark:text-white">{stats.systemHealth?.environment || 'Development'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Recent Users
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                          : user.role === 'premium' 
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
