import create from 'zustand';

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
  isRegisterModalOpen: boolean;
  toggleRegisterModal: () => void;
  initializeAuth: () => void;
}
  
export const useAuthStore = create<AuthState>((set) => ({

  user: null,
  setUser: (user: User) => {
    set({ user }),
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  },
  isLoginModalOpen: false,
  toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
  isRegisterModalOpen: false,
  toggleRegisterModal: () => set((state) => ({ isRegisterModalOpen: !state.isRegisterModalOpen })),
  initializeAuth: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (user && token) {
      set({ user: JSON.parse(user) });
    }
  },

}));