import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Moon, Sun, Bell, Shield, 
  Globe, ChevronRight
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    units: user?.preferences?.units || 'metric',
    language: user?.preferences?.language || 'en',
    notifications: user?.preferences?.notifications || {
      weatherAlerts: true,
      dailySummary: true,
      aiRecommendations: true,
      marketing: false,
    },
  });

  const handlePreferenceChange = async (key, value) => {
    setLoading(true);
    const updates = {
      preferences: {
        ...preferences,
        [key]: value,
      },
    };
    await updateProfile(updates);
    setPreferences(updates.preferences);
    setLoading(false);
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: <Sun className="w-5 h-5" />,
      settings: [
        {
          id: 'theme',
          label: 'Dark Mode',
          description: 'Toggle dark/light theme',
          type: 'toggle',
          value: theme === 'dark',
          onChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Preferences',
      icon: <Globe className="w-5 h-5" />,
      settings: [
        {
          id: 'units',
          label: 'Units',
          description: 'Temperature and measurement units',
          type: 'select',
          value: preferences.units,
          onChange: (val) => handlePreferenceChange('units', val),
          options: [
            { label: 'Celsius (°C)', value: 'metric' },
            { label: 'Fahrenheit (°F)', value: 'imperial' },
          ],
        },
        {
          id: 'language',
          label: 'Language',
          description: 'App language preference',
          type: 'select',
          value: preferences.language,
          onChange: (val) => handlePreferenceChange('language', val),
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
          ],
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          id: 'weatherAlerts',
          label: 'Weather Alerts',
          description: 'Get notified about severe weather',
          type: 'toggle',
          value: preferences.notifications?.weatherAlerts,
          onChange: (val) => {
            const updated = { ...preferences.notifications, weatherAlerts: val };
            handlePreferenceChange('notifications', updated);
          },
        },
        {
          id: 'dailySummary',
          label: 'Daily Summary',
          description: 'Receive AI-powered daily weather summary',
          type: 'toggle',
          value: preferences.notifications?.dailySummary,
          onChange: (val) => {
            const updated = { ...preferences.notifications, dailySummary: val };
            handlePreferenceChange('notifications', updated);
          },
        },
        {
          id: 'aiRecommendations',
          label: 'AI Recommendations',
          description: 'Get personalized AI suggestions',
          type: 'toggle',
          value: preferences.notifications?.aiRecommendations,
          onChange: (val) => {
            const updated = { ...preferences.notifications, aiRecommendations: val };
            handlePreferenceChange('notifications', updated);
          },
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        {
          id: 'privacy',
          label: 'Privacy Policy',
          description: 'View our privacy policy',
          type: 'link',
          href: '/privacy',
        },
        {
          id: 'terms',
          label: 'Terms of Service',
          description: 'View our terms of service',
          type: 'link',
          href: '/terms',
        },
        {
          id: 'data',
          label: 'Manage Data',
          description: 'Export or delete your data',
          type: 'button',
          action: () => console.log('Manage data'),
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize your Aurora Weather experience
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-blue-500">{section.icon}</div>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <div className="font-medium">{setting.label}</div>
                    <div className="text-sm text-gray-500">{setting.description}</div>
                  </div>
                  
                  {setting.type === 'toggle' && (
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      disabled={loading}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        setting.value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          setting.value ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  )}

                  {setting.type === 'select' && (
                    <select
                      value={setting.value}
                      onChange={(e) => setting.onChange(e.target.value)}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {setting.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {setting.type === 'link' && (
                    <a
                      href={setting.href}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  )}

                  {setting.type === 'button' && (
                    <button
                      onClick={setting.action}
                      className="px-4 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Manage
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Settings Icon
const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);