import Head from 'next/head';
import RegisterForm from '@/components/RegisterForm';
import styles from '@/styles/RegisterForm.module.css';
import { useRouter } from 'next/router';

export default function () {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/'); // Redirect to the main page or login page
  };


  return (
      <>
          <Head>
              <title>회원가입 - MOVIE</title>
          </Head>
          <div className={styles.container}>
              <RegisterForm  onSuccess={handleSuccess}/>
          </div>
      </>
  );
}