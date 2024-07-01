import axios from "axios";
import styles from '@/styles/RegisterForm.module.css';
import { useState } from "react";
import { useRouter } from "next/router";

const RegisterForm = () => {
    
  const [formData, setFormData] = useState({ email: '', username: '', password: '', phone: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', formData);
      alert('회원가입이 완료되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('There was an error!', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className={styles.registerForm}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>회원가입</button>
      </form>
    </div>
  );
};

export default RegisterForm;