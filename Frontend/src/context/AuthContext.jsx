import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Normalize role for easy frontend checks
  const getNormalizedRole = (role) => {
    if (!role) return '';
    const r = role.toLowerCase();
    if (r === 'admin') return 'ADMIN';
    if (r === 'store_owner' || r === 'owner') return 'STORE_OWNER';
    return 'NORMAL_USER';
  };

  const currentRole = user ? getNormalizedRole(user.role) : null;

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;
      const authToken = data.token;
      const authUser = data.user;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      setToken(authToken);
      setUser(authUser);
      return { success: true, user: authUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      const data = response.data;
      const authToken = data.token;
      const authUser = data.user;

      if (authToken && authUser) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(authUser));
        setToken(authToken);
        setUser(authUser);
      }
      return { success: true, user: authUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Continue cleanup even if network request fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    role: currentRole,
    isAdmin: currentRole === 'ADMIN',
    isNormalUser: currentRole === 'NORMAL_USER',
    isStoreOwner: currentRole === 'STORE_OWNER',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
