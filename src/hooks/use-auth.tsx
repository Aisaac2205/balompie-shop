import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, LoginCredentials, AuthState, LoginResponse } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Mock admin user for development (replace with real authentication)
const MOCK_ADMIN: AdminUser = {
  id: '1',
  email: 'admin@jerseyrealm.com',
  name: 'Administrador',
  role: 'super_admin',
  createdAt: new Date('2024-01-01'),
};

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
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication logic
          if (credentials.email === 'admin@jerseyrealm.com' && credentials.password === 'admin123') {
            const mockResponse: LoginResponse = {
              user: MOCK_ADMIN,
              token: 'mock-jwt-token-' + Date.now(),
            };
            
            // Store token in localStorage
            localStorage.setItem('admin_token', mockResponse.token);
            
            set({
              user: mockResponse.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return true;
          } else {
            set({
              isLoading: false,
              error: 'Credenciales inválidas. Email: admin@jerseyrealm.com, Contraseña: admin123',
            });
            return false;
          }
        } catch (error) {
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
