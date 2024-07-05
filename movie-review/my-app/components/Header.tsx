import styles from '@/styles/Header.module.css';
import Container from '@/components/Container';
import logoImg from '@/public/logo.png';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import axios from 'axios';

export default function Header() {
  const { user, setUser, clearUser, isLoginModalOpen, toggleLoginModal, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get('/api/userToken', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user:', error.response.data.message);
        clearUser();
        localStorage.removeItem('authToken');
      });
    }
  }, [setUser, clearUser]);

  const handleLogout = () => {
    if(!confirm('로그아웃 하시겠습니까?')) {
      return;
    } 
    clearUser();
    // 로그아웃시 토큰 삭제
    localStorage.removeItem('authToken');
  };

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link href="/">
          <Image src={logoImg} width={150} height={26} alt="Logo" />
        </Link>
        <div className={styles.navLinks}> 
          {user ? (
            <>              
              <Link className={styles.navLink} href="/myPage"><span>{user.username}님</span></Link>
              <a className={styles.navLink} onClick={handleLogout}>로그아웃</a>
            </> 
          ) : (
            <>
              <a className={styles.navLink} href="/register">회원가입</a>
              <a className={styles.navLink} onClick={toggleLoginModal}>로그인</a>
            </>
          )}      
          <Link className={styles.setting} href="/setting">설정</Link>
        </div>
      </Container>
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={toggleLoginModal} />}    
    </header>
  );
}
