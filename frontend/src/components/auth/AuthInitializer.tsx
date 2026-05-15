'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export default function AuthInitializer() {
  const { token, fetchProfile, initialized } = useAuthStore();
  useEffect(() => {
    if (token && !initialized) {
      fetchProfile();
    }
  }, []);
  return null;
}
