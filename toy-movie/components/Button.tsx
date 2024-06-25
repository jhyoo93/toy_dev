import { ReactNode } from 'react';
import styles from '@/styles/LoginButton.module.css';

// 상속
// children을 쓸땐 ReactNode 사용해야함
interface Props {
  className?: string;
  id?: string;
  children?: ReactNode;
  onClick: any;
}

export default function Button({ className = '', id, children,  onClick}: Props) {
  const classNames = `${styles.button} ${className}`;
  return (
    <button className={classNames} id={id} onClick={onClick}>
      {children}
    </button>
  );
}
