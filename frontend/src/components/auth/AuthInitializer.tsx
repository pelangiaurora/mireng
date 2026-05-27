'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export default function AuthInitializer() {
  const { token, fetchProfile, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized) return;
    if (token) {
      fetchProfile(); // ada token → fetch profile
    } else {
      useAuthStore.setState({ initialized: true }); // tidak ada token → langsung initialized
    }
  }, []);

  return null;
}