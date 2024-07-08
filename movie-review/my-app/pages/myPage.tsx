import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import styles from '@/styles/MyPage.module.css';
import Image, { StaticImageData } from 'next/image';
import defaultUserImg from '@/public/default-user.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';


const MyPage = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | StaticImageData>(user?.image || defaultUserImg);
  const queryClient = useQueryClient();

  const { data: userData, refetch } = useQuery('user', async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const response = await axios.get('/api/userToken', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    }
  }, {
    //enabled: !!localStorage.getItem('authToken'),
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
    },
    onError: () => {
      clearUser();
      localStorage.removeItem('authToken');
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = () => {

    if(!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    clearUser();
    localStorage.removeItem('authToken');
    router.push('/');
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
        const { filePath } = response.data;
        console.log('업로드 성공:', filePath);
        refetch(); // 이미지 업로드 후 사용자 데이터 다시 불러오기
        toast.success('이미지가 성공적으로 업로드되었습니다!');
        queryClient.invalidateQueries('user');
      },
      onError: (error) => {
        console.error('파일 업로드 실패:', error);
        toast.error(`이미지 업로드 실패: ${error.response?.data.message || error.message}`);
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
        console.log('파일 업로드 중:', file);
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
        console.log('삭제 성공');
        if (user) {
          setUser({
            ...user,
            image: '',
          });
        }
        toast.success('이미지가 성공적으로 삭제되었습니다!');
        queryClient.invalidateQueries('user');
      },
      onError: (error) => {
        console.error('파일 삭제 실패:', error);
        toast.error(`이미지 삭제 실패: ${error.response?.data.message || error.message}`);
      },
    }
  );

  const handleImageDelete = () => {
    if (user?.id) {
      console.log('이미지 삭제 중:', user.image);
      deleteMutation.mutate();
    } else {
      toast.error('사용자 ID가 없습니다.');
    }
  };

  const getImageSrc = (src: string | StaticImageData): string => {
    if (typeof src === 'string') {
      return `${src.startsWith('/') ? '' : '/'}${src}`;
    }
    return src.src;
  };


  if (!user) {
    return <div>로딩 중...</div>;
  }  


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
          {imageSrc !== defaultUserImg && (
            <button className={styles.deleteButton} onClick={handleImageDelete}>기본이미지</button>
          )}
          <h5 className={styles.header}>{user.username}</h5>
          <p className={styles.userInfo}>{user.email}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
      </div>
  );
};

export default MyPage;