import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Send, Mail, Users, Clock, Check, X,
  AlertCircle, MessageSquare, Megaphone, Filter,
  Calendar, Trash2, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  const [selectedType, setSelectedType] = useState('all');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'alert',
    audience: 'all',
  });

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all fields');
      return;
    }

    const notification = {
      id: Date.now(),
      ...newNotification,
      status: 'sent',
      sentAt: 'Just now',
      read: false,
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'alert', audience: 'all' });
    toast.success('Notification sent successfully!');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getTypeColor = (type) => {
    const colors = {
      alert: 'border-red-500/30 bg-red-500/10 text-red-500',
      system: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
      feedback: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500',
      marketing: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
    };
    return colors[type] || colors.system;
  };

  const getStatusColor = (status) => {
    return status === 'sent' 
      ? 'bg-green-500/10 text-green-500' 
      : 'bg-yellow-500/10 text-yellow-500';
  };

  const filteredNotifications = selectedType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and send notifications to users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors">
            <Megaphone className="w-4 h-4" />
            Broadcast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Notification Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" />
              Send Notification
            </h3>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Notification title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Your message here..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="alert">Alert</option>
                  <option value="system">System</option>
                  <option value="feedback">Feedback</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audience</label>
                <select
                  value={newNotification.audience}
                  onChange={(e) => setNewNotification({ ...newNotification, audience: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="active">Active Users</option>
                  <option value="new">New Users</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Notification
              </button>
            </form>
          </div>
        </div>

        {/* Notification List */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="alert">Alerts</option>
                <option value="system">System</option>
                <option value="feedback">Feedback</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredNotifications.length} notifications
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`glass-card p-4 border-l-4 ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.sentAt}
                        </span>
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}