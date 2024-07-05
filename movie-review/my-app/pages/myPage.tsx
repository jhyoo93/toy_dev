import styles from '@/styles/MyPage.module.css';
import defaultUserImg from '@/public/default-user.png';
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from 'next/image';

const MyPage = () => {

    const {user, clearUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/login');
        }
    }), [user, router];

    if(!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>           
            <Image
                src={user.image || defaultUserImg} // 사용자 이미지가 없으면 기본 이미지 사용
                alt="User Image"
                className={styles.userImage}
                width={150}
                height={150}
            />           
            <h5 className={styles.header}>{user.username}</h5>
            <p className={styles.userInfo}>{user.email}</p>
        </div>
    );
};

export default MyPage;