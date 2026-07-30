import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, CreditCard, TrendingUp, Activity,
  RefreshCw, Shield
} from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    activeUsers: 0,
    aiRequests: 0,
  });

  useEffect(() => {
    setStats({
      users: 1247,
      revenue: 5689,
      activeUsers: 892,
      aiRequests: 3456,
    });
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your Aurora Weather platform
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold">{stats.users}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Revenue</div>
              <div className="text-2xl font-bold">${stats.revenue}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Active Users</div>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">AI Requests</div>
              <div className="text-2xl font-bold">{stats.aiRequests}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}