import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'tenant' | 'landlord' | 'admin';
  profileImage: string;
  onboardingCompleted?: boolean;
  profileCompletion?: number;
  verificationStatus?: {
    emailVerified: boolean;
    phoneVerified: boolean;
    idVerified: boolean;
    addressVerified: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false, error: null }),

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error: any) {
      set({ error: 'Failed to logout' });
    }
  }
}));
