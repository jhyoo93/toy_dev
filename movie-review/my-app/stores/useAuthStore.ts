import create from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  image?: string;
  token?: string; // 토큰 필드 추가
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
    if (user.token) {
      Cookies.set('authToken', user.token);
    }
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem('user');
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
