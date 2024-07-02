import { useAuthStore } from '@/store/useAuthStore';
import styles from '@/styles/LoginModal.module.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const { setUser } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const mutation = useMutation(
        (data: { email: string; password: string }) => axios.post('/api/auth/login', data),
        {
          onSuccess: (data) => {
            const { token, user } = data.data;
            setUser({ token, ...user });
            onClose();
          },
          onError: (error) => {
            console.error('Error during login:', error);
          },
        }
    );

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      mutation.mutate({ email, password });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose}></div>
            <div className={styles.modal}>               
                <form onSubmit={handleLogin}>
                    <h2>로그인</h2>
                    <div className={styles.formGroup}>
                        <label>이메일 </label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        
                    </div>
                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        
                    </div>
                    <button className={styles.loginButton} type="submit">로그인</button>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </form>
            </div>
        </>
    );
};

export default LoginModal;