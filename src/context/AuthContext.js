import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      

      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('❌ Error restoring user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {

      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
  try {

    
    const response = await authApi.login({ 
      email: email.trim(), 
      password: password.trim() 
    });
    

    
    const { user, token } = response.data.data;

    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    

    toast.success(`Welcome back, ${user.firstName}!`);
    return { success: true };
  } catch (error) {
    console.error('❌ Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

  const guestLogin = async () => {
    try {

      const response = await authApi.guestLogin();

      
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      

      return { success: true };
    } catch (error) {
      console.error('❌ Guest login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (data) => {
    try {

      const response = await authApi.register(data);

      
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
    window.location.href = '/auth/login';
  };

  const updateProfile = async (data) => {
    try {
      const response = await authApi.updateProfile(data);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated!');
      return { success: true };
    } catch (error) {
      console.error('❌ Update profile error:', error);
      toast.error(error.response?.data?.error || 'Update failed');
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    guestLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
