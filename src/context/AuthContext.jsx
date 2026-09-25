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
      // Decode user data from localStorage for immediate availability
      const storedUser = localStorage.getItem('user');
      let currentUser = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
      }

      // If user is a TEAM_USER, fetch the latest team info from the backend
      if (currentUser && currentUser.role === 'TEAM_USER') {
        const res = await api.get('/team/me');
        if (res.success && res.data && res.data.team) {
          const updatedUser = {
            ...currentUser,
            teamName: res.data.team.teamName,
            teamType: res.data.team.teamType,
            logo: res.data.team.logo
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else if (currentUser && currentUser.role === 'ADMIN') {
        const res = await api.get('/admin/profile');
        if (res.success && res.data) {
          const updatedUser = {
            ...currentUser,
            name: res.data.name,
            email: res.data.email,
            profilePhoto: res.data.profilePhoto
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Failed to load user', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    refreshUser();
    
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshUser, logout]);

  useEffect(() => {
    if (isLoading) return;
    
    // Auth Guards
    if (!user && pathname.startsWith('/panel')) {
      router.replace('/login');
    } else if (!user && pathname.startsWith('/admin')) {
      router.replace('/login');
    } else if (user && user.role === 'TEAM_USER') {
      if (pathname === '/login' || pathname.startsWith('/admin')) {
        router.replace('/panel/dashboard');
      } else if (user.mustChangePassword && pathname !== '/panel/change-password') {
        router.replace('/panel/change-password');
      }
    } else if (user && user.role === 'ADMIN') {
      if (pathname === '/login' || pathname.startsWith('/panel')) {
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
