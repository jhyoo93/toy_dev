import Link from 'next/link';
import Container from './Container';
import logoImg from '@/public/logo.svg';
import styles from '@/styles/Header.module.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link href="/">
        <Image src={logoImg} width={150} height={26} alt="TH" />
        </Link>     
        <Link href="/login">로그인</Link>
        <Link className={styles.setting} href="/setting">설정</Link>
      </Container>
    </header>
  );
}
