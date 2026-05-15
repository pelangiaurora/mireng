import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get('token') || null,
  loading: false,
  initialized: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const access_token = res.data.data.access_token;
      Cookies.set('token', access_token, { expires: 7 });
      set({ token: access_token });
      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      set({ user: res.data.data, initialized: true });
    } catch {
      Cookies.remove('token');
      set({ user: null, token: null, initialized: true });
    }
  },
  logout: () => {
    Cookies.remove('token');
    set({ user: null, token: null });
  },
}));
