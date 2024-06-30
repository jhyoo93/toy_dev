import styles from '@/styles/Header.module.css';
import Container from '@/components/Container';
import logoImg from '@/public/logo.png';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
        <Container className={styles.container}>
          <Link href="/">
            <Image src={logoImg} width={150} height={26} alt="Logo" />
          </Link>
          <Link className={styles.setting} href="/setting">설정</Link>
          <Link href="/register">회원가입</Link>
        </Container>      
    </header>
  );
}
