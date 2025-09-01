import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, LoginCredentials, AuthState, LoginResponse } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            set({
              isLoading: false,
              error: data.error || 'Error de autenticación',
            });
            return false;
          }

          // Store token in localStorage
          localStorage.setItem('admin_token', data.token);
          
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: 'Error de conexión. Intente nuevamente.',
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
