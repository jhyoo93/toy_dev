import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import styles from '@/styles/MyPage.module.css';
import Image, { StaticImageData } from 'next/image';
import defaultUserImg from '@/public/default-user.png';
import axios, { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';

interface ErrorResponse {
  message: string;
}

const MyPage = () => {
  const { user, setUser, clearUser, initializeAuth } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const { data: userData, refetch } = useQuery('user', async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      const response = await axios.get('/api/userToken', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.user;
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
      };
    }
  }, {
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('authToken'),
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
    },
    onError: (error: AxiosError) => {
      clearUser();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  });

  useEffect(() => {
    if (!user) {
      if (typeof window !== 'undefined') {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleLogout = () => {
    clearUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      router.push('/');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadMutation = useMutation(
    (formData: FormData) =>
      axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    {
      onSuccess: (response) => {
        refetch(); // 이미지 업로드 후 사용자 데이터 다시 불러오기
        toast.success('이미지가 성공적으로 업로드되었습니다!');
        queryClient.invalidateQueries('user');
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`이미지 업로드 실패: ${errorMessage}`);
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      if (user?.id) {
        formData.append('userId', user.id);
        uploadMutation.mutate(formData);
      } else {
        toast.error('사용자 ID가 없습니다.');
      }
    }
  };

  const deleteMutation = useMutation(
    () =>
      axios.delete('/api/delete', {
        data: { filePath: user?.image, userId: user?.id },
      }),
    {
      onSuccess: () => {
        if (user) {
          setUser({
            ...user,
            image: '',
            id: user.id, // id 값을 명시적으로 지정
            username: user.username, // username 값을 명시적으로 지정
            email: user.email, // email 값을 명시적으로 지정
            phone: user.phone // phone 값을 명시적으로 지정
          });
        }
        toast.success('이미지가 성공적으로 삭제되었습니다!');
        queryClient.invalidateQueries('user');
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`이미지 삭제 실패: ${errorMessage}`);
      },
    }
  );

  const handleImageDelete = () => {
    if (user?.id) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success('이미지가 성공적으로 삭제되었습니다!');
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          const errorMessage = error.response?.data?.message || error.message;
          toast.error(`이미지 삭제 실패: ${errorMessage}`);
        },
      });
    } else {
      toast.error('사용자 ID가 없습니다.');
    }
  };

  const getImageSrc = (src: string | undefined): string => {
    if (src) {
      return `${src.startsWith('/') ? '' : '/'}${src}`;
    }
    return defaultUserImg.src;
  };

  if (!user) {
    return <div>로딩 중...</div>;
  }


  return (
      <div className={styles.container}>       
          <div className={styles.userImageContainer} onClick={handleImageClick}>
              <Image
                  src={getImageSrc(user.image)} // 사용자 이미지가 없으면 기본 이미지 사용
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
          {user.image && (
            <button className={styles.deleteButton} onClick={handleImageDelete}>이미지 삭제</button>
          )}
          <h5 className={styles.header}>{user.username}</h5>
          <p className={styles.userInfo}>{user.email}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
      </div>
  );
};

export default MyPage;