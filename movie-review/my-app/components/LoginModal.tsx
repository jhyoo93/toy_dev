import styles from '@/styles/LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    if(!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose}></div>
            <div className={styles.modal}>               
                <form>
                    <div className={styles.formGroup}>
                    <h2>로그인</h2>
                        <label>
                            이메일 <input type="email" name="email" required />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            비밀번호 <input type="password" name="password" required />
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