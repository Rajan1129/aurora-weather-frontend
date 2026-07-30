import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { EnvironmentBadge } from './components/EnvironmentBadge'; // ✅ Add this
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminUsers } from './pages/Admin/Users';
import { AdminSubscriptions } from './pages/Admin/Subscriptions';
import { AdminWeather } from './pages/Admin/Weather';
import { AdminAIUsage } from './pages/Admin/AIUsage';
import { AdminAnalytics } from './pages/Admin/Analytics';
import { AdminNotifications } from './pages/Admin/Notifications';
import { AdminSettings } from './pages/Admin/Settings';
import { AdminReports } from './pages/Admin/Reports';
import LandingPage from './pages/Landing';
import Dashboard from './pages/Dashboard';
import WeatherDetails from './pages/WeatherDetails';
import WeatherMap from './pages/WeatherMap';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Auth from './pages/Auth';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/*" element={<Auth />} />
              <Route path="/premium" element={<Premium />} />
              
              {/* Protected Routes - Requires Authentication */}
              <Route element={<ProtectedRoute />}>
                {/* Main App Layout */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/weather" element={<WeatherDetails />} />
                  <Route path="/weather-map" element={<WeatherMap />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                
                {/* Admin Routes - Requires Admin Role (Handled in AdminLayout) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="subscriptions" element={<AdminSubscriptions />} />
                  <Route path="weather" element={<AdminWeather />} />
                  <Route path="ai-usage" element={<AdminAIUsage />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="reports" element={<AdminReports />} />
                </Route>
              </Route>
              
              {/* 404 - Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Environment Badge - Shows current environment */}
            <EnvironmentBadge /> {/* ✅ Add this */}
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: '!bg-white/90 !backdrop-blur-lg !rounded-xl !shadow-xl !border !border-white/20',
                success: {
                  className: '!bg-green-50/90 !backdrop-blur-lg !rounded-xl !shadow-xl',
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: 'white',
                  },
                },
                error: {
                  className: '!bg-red-50/90 !backdrop-blur-lg !rounded-xl !shadow-xl',
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
                loading: {
                  className: '!bg-blue-50/90 !backdrop-blur-lg !rounded-xl !shadow-xl',
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: 'white',
                  },
                },
              }}
            />
          </BrowserRouter>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;