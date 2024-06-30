import axios from "axios";
import styles from '@/styles/RegisterForm.module.css';
import { useState } from "react";

const RegisterForm = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('/api/register', {
            email,
            username,
            password,
            phone,
          });
          setMessage(response.data.message);
        } catch (error) {
          setMessage('회원가입 실패');
        }
      };

    return (
      <div className={styles.registerForm}>
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <button type="submit">회원가입</button>
        </form>
        {message && <p>{message}</p>}
    </div>
    );
};

export default RegisterForm;