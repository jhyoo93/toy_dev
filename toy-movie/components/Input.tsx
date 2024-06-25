import styles from '@/styles/LoginInput.module.css';
import { InputHTMLAttributes } from 'react';

// HTMLAttributes 제네릭 타입
// HTML 기본 타입 속성으로 Prpos 지정할때 사용
interface Props extends InputHTMLAttributes<HTMLInputElement> {

}

export default function Input({ className = '', ...rest }: Props) {
  const classNames = `${styles.input} ${className}`;
  return <input className={classNames} {...rest} />;
}
