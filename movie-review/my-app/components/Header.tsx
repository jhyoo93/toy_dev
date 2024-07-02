import styles from '@/styles/Header.module.css';
import Container from '@/components/Container';
import logoImg from '@/public/logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { user, clearUser } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
  };

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link href="/">
          <Image src={logoImg} width={150} height={26} alt="Logo" />
        </Link>
        <div className={styles.navLinks}> 
          <Link className={styles.setting} href="/setting">설정</Link>
          {user ? (
            <>
              <span>{user.username}님</span>
              <a className={styles.navLink} onClick={handleLogout}>로그아웃</a>
            </> 
          ) : (
            <>
              <Link className={styles.navLink} href="/register">회원가입</Link>
              <a className={styles.navLink} onClick={() => setIsLoginOpen(true)}>로그인</a>
            </>
          )}      
        </div>
      </Container>
      {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}    
    </header>
  );
}
