import styles from '@/styles/Header.module.css';
import Container from '@/components/Container';
import logoImg from '@/public/logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Header() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <header className={styles.header}>
        <Container className={styles.container}>
          <Link href="/">
            <Image src={logoImg} width={150} height={26} alt="Logo" />
          </Link>
          <div className={styles.navLinks}> 
            <Link className={styles.setting} href="/setting"></Link>
            <Link className={styles.navLink} href="/register">회원가입</Link>
            <a className={styles.navLink} onClick={openLoginModal}>로그인</a>
          </div>
        </Container>
        {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal}/>}    
    </header>
  );
}
