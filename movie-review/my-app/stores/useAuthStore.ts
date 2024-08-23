import create from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  token?: string;
  username: string;
  email: string;
  phone: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoginModalOpen: boolean;
  toggleLoginModal: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,  // 초기 상태는 로그아웃 상태

  setUser: (user: User) => {
    console.log("Logging in:", user);  // 로그인 시 사용자 정보 출력
    set({ user, isLoggedIn: true });  // isLoggedIn 상태를 true로 설정
    localStorage.setItem('user', JSON.stringify(user));
    if (user.token) {
      Cookies.set('authToken', user.token);
    }
  },
  clearUser: () => {
    set({ user: null, isLoggedIn: false });  // 로그아웃 시 isLoggedIn 상태를 false로 설정
    localStorage.removeItem('user');
    Cookies.remove('authToken');
  },
  isLoginModalOpen: false,

  toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
  initializeAuth: () => {
    const user = localStorage.getItem('user');
    const token = Cookies.get('authToken');
    if (user && token) {
      set({ user: JSON.parse(user), isLoggedIn: true });  // 저장된 사용자 정보로 로그인 상태를 초기화
    }
  },
}));
