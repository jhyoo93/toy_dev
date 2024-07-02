import styles from '@/styles/LoginModal.module.css';
import axios from 'axios';
import React, { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    if(!isOpen) return null;

    // input창 onChange이벤트
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prevState => ({ ...prevState, [name]: value }));
    };    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const res = await axios.post('/api/login', formData);

        alert('로그인 성공!');
        onClose(); // 모달창 닫기
      } catch (e) {
        console.error('There was an error!', error);
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    };

    return (
        <>
            <div className={styles.backdrop} onClick={onClose}></div>
            <div className={styles.modal}>               
                <form onSubmit={handleSubmit}>
                    <h2>로그인</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.formGroup}>
                        <label>
                            이메일 <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            비밀번호 <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </label>
                    </div>
                    <button className={styles.loginButton} type="submit">로그인</button>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                </form>
            </div>
        </>
    );
};

export default LoginModal;