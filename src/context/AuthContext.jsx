"use client";

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Decode user data from localStorage for immediate availability,
      // then we could verify with backend if there was a /me endpoint
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (isLoading) return;
    
    // Auth Guards
    if (!user && pathname.startsWith('/panel')) {
      router.replace('/login');
    } else if (!user && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (user && user.role === 'TEAM_USER') {
      if (pathname === '/login' || pathname.startsWith('/admin')) {
        router.replace('/panel/dashboard');
      } else if (user.mustChangePassword && pathname !== '/panel/change-password') {
        router.replace('/panel/change-password');
      }
    } else if (user && user.role === 'ADMIN') {
      if (pathname === '/admin/login' || pathname.startsWith('/panel') || pathname === '/login') {
        router.replace('/admin/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    if (userData.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      if (userData.mustChangePassword) {
        router.push('/panel/change-password');
      } else {
        router.push('/panel/dashboard');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (pathname.startsWith('/admin')) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}