import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Download, RefreshCw, Activity, User, MapPin, Cloud, Brain } from 'lucide-react';

export function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Simulate fetching logs
    setTimeout(() => {
      setLogs([
        { id: 1, user: 'John Doe', action: 'Logged in', type: 'auth', timestamp: '2024-01-15 14:30:00', ip: '192.168.1.1', location: 'New York' },
        { id: 2, user: 'Jane Smith', action: 'Checked weather', type: 'weather', timestamp: '2024-01-15 14:25:00', ip: '192.168.1.2', location: 'London' },
        { id: 3, user: 'Mike Johnson', action: 'Used AI Assistant', type: 'ai', timestamp: '2024-01-15 14:20:00', ip: '192.168.1.3', location: 'Tokyo' },
        { id: 4, user: 'Sarah Wilson', action: 'Updated profile', type: 'profile', timestamp: '2024-01-15 14:15:00', ip: '192.168.1.4', location: 'Sydney' },
        { id: 5, user: 'Tom Brown', action: 'Saved location', type: 'location', timestamp: '2024-01-15 14:10:00', ip: '192.168.1.5', location: 'Toronto' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type) => {
    const colors = {
      auth: 'bg-blue-500/10 text-blue-500',
      weather: 'bg-cyan-500/10 text-cyan-500',
      ai: 'bg-purple-500/10 text-purple-500',
      profile: 'bg-green-500/10 text-green-500',
      location: 'bg-yellow-500/10 text-yellow-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const getTypeIcon = (type) => {
    const icons = {
      auth: <User className="w-4 h-4" />,
      weather: <Cloud className="w-4 h-4" />,
      ai: <Brain className="w-4 h-4" />,
      profile: <User className="w-4 h-4" />,
      location: <MapPin className="w-4 h-4" />,
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'auth', 'weather', 'ai', 'profile', 'location'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                filterType === type
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{log.user}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {getTypeIcon(log.type)}
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.ip}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
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