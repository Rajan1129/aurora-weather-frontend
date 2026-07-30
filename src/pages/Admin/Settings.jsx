import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Globe, Shield, Bell, Mail,
  Database, Cloud, Users, Lock, Key,
  Palette, Smartphone, Zap, Save,
  ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'Aurora Weather',
    appVersion: '2.1.0',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    defaultTheme: 'auto',
    defaultUnits: 'metric',
    enableAI: true,
    enableMaps: true,
    enablePremium: true,
    enableNotifications: true,
    enableWeatherAlerts: true,
    enableSocialLogin: true,
    dataRetentionDays: 30,
    cacheDuration: 15,
    apiRateLimit: 100,
  });

  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings?')) {
      toast.success('Settings reset to default');
    }
  };

  const settingsGroups = [
    {
      title: 'General Settings',
      icon: Settings,
      fields: [
        { key: 'appName', label: 'App Name', type: 'text' },
        { key: 'appVersion', label: 'Version', type: 'text', disabled: true },
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'toggle' },
        { key: 'registrationEnabled', label: 'Allow Registration', type: 'toggle' },
        { key: 'defaultTheme', label: 'Default Theme', type: 'select', options: ['light', 'dark', 'auto'] },
        { key: 'defaultUnits', label: 'Default Units', type: 'select', options: ['metric', 'imperial'] },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      fields: [
        { key: 'emailVerification', label: 'Email Verification', type: 'toggle' },
        { key: 'twoFactorAuth', label: 'Two-Factor Auth', type: 'toggle' },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number' },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number' },
        { key: 'enableSocialLogin', label: 'Enable Social Login', type: 'toggle' },
      ],
    },
    {
      title: 'Features',
      icon: Zap,
      fields: [
        { key: 'enableAI', label: 'Enable AI Features', type: 'toggle' },
        { key: 'enableMaps', label: 'Enable Weather Maps', type: 'toggle' },
        { key: 'enablePremium', label: 'Enable Premium', type: 'toggle' },
        { key: 'enableNotifications', label: 'Enable Notifications', type: 'toggle' },
        { key: 'enableWeatherAlerts', label: 'Enable Weather Alerts', type: 'toggle' },
      ],
    },
    {
      title: 'Performance',
      icon: Database,
      fields: [
        { key: 'dataRetentionDays', label: 'Data Retention (days)', type: 'number' },
        { key: 'cacheDuration', label: 'Cache Duration (minutes)', type: 'number' },
        { key: 'apiRateLimit', label: 'API Rate Limit (per minute)', type: 'number' },
      ],
    },
  ];

  const renderField = (field) => {
    const value = settings[field.key];
    
    if (field.type === 'toggle') {
      return (
        <button
          onClick={() => handleToggle(field.key)}
          className="relative w-12 h-6 rounded-full transition-colors"
          style={{ backgroundColor: value ? '#8b5cf6' : '#d1d5db' }}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              value ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          disabled={field.disabled}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={(e) => handleChange(field.key, e.target.value)}
        className="w-24 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        disabled={field.disabled}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your application settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsGroups.map((group, index) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Icon className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-semibold">{group.title}</h3>
              </div>

              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}