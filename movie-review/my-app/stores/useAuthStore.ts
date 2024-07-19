import create from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoginModalOpen: boolean;
  toggleLoginModal: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem('user');
    //localStorage.remove('authToken');
    Cookies.remove('authToken');
  },
  isLoginModalOpen: false,
  toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
  initializeAuth: () => {
    const user = localStorage.getItem('user');
    const token = Cookies.get('authToken');
    if (user && token) {
      set({ user: JSON.parse(user) });
    }
  },
}));