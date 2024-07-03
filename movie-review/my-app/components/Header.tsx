import styles from '@/styles/Header.module.css';
import Container from '@/components/Container';
import logoImg from '@/public/logo.png';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';
import RegisterForm from './RegisterForm';

export default function Header() {
  const { isRegisterModalOpen, isLoginModalOpen, toggleRegisterModal, toggleLoginModal, user, clearUser } = useAuthStore();

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
              <a className={styles.navLink} href="/register">회원가입</a>
              <a className={styles.navLink} onClick={toggleLoginModal}>로그인</a>
            </>
          )}      
        </div>
      </Container>
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={toggleLoginModal} />}    
    </header>
  );
}
