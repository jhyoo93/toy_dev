import axios from "axios";
import styles from '@/styles/RegisterForm.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import defaultUserImg from '@/public/default-user.png';

interface RegisterFormProps {
  onSuccess: () => void;
}

const schema = yup.object().shape({
  username: yup.string().required('사용자 이름을 입력해주세요').min(3, '사용자 이름은 최소 3글자 이상이어야 합니다'),
  email: yup.string().required('이메일을 입력해주세요').email('유효한 이메일 주소를 입력해주세요'),
  password: yup.string().required('비밀번호를 입력해주세요').min(6, '비밀번호는 최소 6글자 이상이어야 합니다'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], '비밀번호가 일치하지 않습니다')
    .required('비밀번호 확인을 입력해주세요'),
  phone: yup.string().matches(/^[0-9]+$/, '유효한 휴대폰번호를 입력해주세요').min(10, '휴대폰번호는 최소 10자리 이상이어야 합니다'),
});

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { toggleRegisterModal } = useAuthStore();

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/register', data);
      alert('회원가입이 완료되었습니다!');
      toggleRegisterModal();
      onSuccess();
    } catch (error) {
      console.error('에러가 발생했습니다!', error);
    }
  };

  return (
    <div className={styles.registerForm}>
      <h1>회원가입</h1>
      <br></br>
      <br></br>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.userInfo}>
          <Image 
            src={defaultUserImg} // 사용자 이미지가 없으면 기본 이미지 사용
            alt="User Image"
            className={styles.userImage}
            width={150}
            height={150}
            />
        </div>
        <span className={styles.inputRequired}>* 필수입력사항 입니다</span>
        <div className={styles.formGroup}>
          <label>사용자 이름   <span className={styles.required}>*</span></label>
          <input {...register('username')} />
          {errors.username && <p className={styles.error}>{errors.username.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>이메일   <span className={styles.required}>*</span></label>
          <input {...register('email')} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>비밀번호   <span className={styles.required}>*</span></label>
          <input type="password" {...register('password')} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>비밀번호 확인   <span className={styles.required}>*</span></label>
          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>전화번호   <span className={styles.required}>*</span></label>
          <input {...register('phone')} />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        </div>
        <button type="submit" className={styles.button}>회원가입</button>
      </form>
    </div>
  );
};

export default RegisterForm;