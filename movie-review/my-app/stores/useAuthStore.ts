import create from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}
  
interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoginModalOpen: boolean;
  toggleLoginModal: () => void;
  isRegisterModalOpen: boolean;
  toggleRegisterModal: () => void;
}
  
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
  isLoginModalOpen: false,
  toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
  isRegisterModalOpen: false,
  toggleRegisterModal: () => set((state) => ({ isRegisterModalOpen: !state.isRegisterModalOpen })),
}));