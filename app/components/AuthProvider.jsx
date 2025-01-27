"use client";
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { refreshToken } from '@/lib/firebase';

export default function AuthProvider({ children }) {
  useEffect(() => {
    // Set up token refresh
    const tokenRefreshInterval = setInterval(() => {
      refreshToken();
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    // Set up auth state observer
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await refreshToken();
      }
    });

    return () => {
      clearInterval(tokenRefreshInterval);
      unsubscribe();
    };
  }, []);

  return children;
} 