import styles from '@/styles/MyPage.module.css';
import defaultUserImg from '@/public/default-user.png';
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from 'next/image';
import axios from 'axios';

const MyPage = () => {

    const { user, setUser, clearUser } = useAuthStore();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string | StaticImageData>(user?.image || defaultUserImg);

    useEffect(() => {
        if(!user) {
            router.push('/login');
        }
    }), [user, router];

    if(!user) {
        return <div>Loading...</div>;
    }

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          const formData = new FormData();
          formData.append('file', file);
    
          try {
            const response = await axios.post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            const { filePath } = response.data;
            setImageSrc(filePath);
            setUser({ ...user, image: filePath });
          } catch (error) {
            console.error('Failed to upload file:', error);
          }
        }
    };

    const getImageSrc = (src: string | StaticImageData): string => {
        if (typeof src === 'string') {
          return src.startsWith('/') ? src : `/${src}`;
        }
        return src.src;
    };

    return (
        <div className={styles.container}>       
            <div className={styles.userImageContainer} onClick={handleImageClick}>
                <Image
                    src={getImageSrc(imageSrc)} // 사용자 이미지가 없으면 기본 이미지 사용
                    alt="User Image"
                    className={styles.userImage}
                    width={150}
                    height={150}
                /> 
                <div className={styles.editIcon}>
                    <span>✎</span>
                </div>
            </div>         
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />  
            <h5 className={styles.header}>{user.username}</h5>
            <p className={styles.userInfo}>{user.email}</p>
        </div>
    );
};

export default MyPage;