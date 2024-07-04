import styles from '@/styles/LoginModal.module.css';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('유효한 이메일을 입력해주세요').required('이메일을 입력해주세요'),
  password: yup.string().required('비밀번호를 입력해주세요'),
});

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
      resolver: yupResolver(schema),
    });
    const [ loginError, setLoginError ] = useState('');
    const { setUser } = useAuthStore();
    
    const mutation = useMutation((data: LoginData) => axios.post('/api/login', data), {
      onSuccess: (response) => {
        setUser(response.data.user);
        onClose();
      },
      onError: (error) => {
        setLoginError('로그인에 실패했습니다. 다시 시도해주세요.');
        console.error('로그인 실패:', error);
      },
    });
  
    const onSubmit = (data: LoginData) => {
      mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose}></div>
            <div className={styles.modal}>               
            <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>로그인</h2>
                    <div className={styles.formGroup}>
                        <label>이메일 </label>
                        <input type="email" {...register('email', { required: '이메일을 입력해주세요' })} />
                        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input type="password" {...register('password', { required: '비밀번호를 입력해주세요' })} />
                        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                    </div>
                    <button className={styles.loginButton} type="submit">로그인</button>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </form>
                {loginError && <p className={styles.error}>{loginError}</p>}
            </div>
        </>
    );
};

export default LoginModal;