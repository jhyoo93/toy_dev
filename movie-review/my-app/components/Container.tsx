import styles from '@/styles/Container.module.css';

export default function Container({ className = '', page, ...props } : any) {
  const classNames = `${styles.container} ${
    page ? styles.page : ''
  } ${className}`;
  return <div className={classNames} {...props} />;
}
