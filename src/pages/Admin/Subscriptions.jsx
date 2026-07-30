import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingUp, Users, Calendar, Clock, Check, X, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          adminApi.getUsers(1, 100),
          adminApi.getStats()
        ]);
        
        const allUsers = usersRes.data.data.users || [];
        const premiumUsers = allUsers.filter(u => u.role === 'premium' || (u.subscription && u.subscription.plan !== 'free'));
        
        const mappedSubs = premiumUsers.map(u => ({
          id: u._id,
          user: (u.firstName + ' ' + u.lastName).trim() || u.email,
          plan: u.subscription?.plan || 'Premium',
          status: u.subscription?.status || 'active',
          amount: u.subscription?.plan === 'premium_yearly' ? '$99.99' : '$9.99',
          start: u.subscription?.startDate ? new Date(u.subscription.startDate).toISOString().split('T')[0] : '-',
          end: u.subscription?.endDate ? new Date(u.subscription.endDate).toISOString().split('T')[0] : '-',
        }));

        setSubscriptions(mappedSubs);
        
        const adminStats = statsRes.data.data;
        setStats({
          total: adminStats.users?.premium || 0,
          active: adminStats.users?.premium || 0,
          expired: 0,
          revenue: (adminStats.users?.premium || 0) * 9.99,
        });
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user subscriptions and plans</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subscriptions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-500">{stats.active}</p>
            </div>
            <Check className="w-8 h-8 text-green-500/50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-red-500">{stats.expired}</p>
            </div>
            <X className="w-8 h-8 text-red-500/50" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-green-500">${stats.revenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500/50" />
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div></td>
                  </tr>
                ))
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{sub.user}</td>
                    <td className="px-6 py-4">{sub.plan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{sub.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.start}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.end}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}