import Head from 'next/head';
import RegisterForm from '@/components/RegisterForm';
import styles from '@/styles/RegisterForm.module.css';

export default function () {
    return (
        <>
            <Head>
                <title>회원가입 - MOVIE</title>
            </Head>
            <div className={styles.container}>
                <RegisterForm />
            </div>
        </>
    );
}