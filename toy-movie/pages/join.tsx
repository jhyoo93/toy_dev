import Image from 'next/image';
import Button from '../components/Button';
import styles from '@/styles/RegisterPage.module.css';
import GoogleImage from '@/assets/google.svg';
import HorizontalRule from '@/components/HorizontalRule';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Link from '../components/Link';


export default function join() {

  return (
    <>
      <h1 className={styles.Heading}>회원가입</h1>
      <Button className={styles.GoogleButton} type="button" appearance="outline">
          <img src={GoogleImage} alt="Google" />구글로 시작하기
      </Button>
      <HorizontalRule className={styles.HorizontalRule}>또는</HorizontalRule>
      <form className={styles.Form} >
        <Label className={styles.Label} htmlFor="name">
          이름
        </Label>
        <Input
          id="name"
          className={styles.Input}
          name="name"
          type="text"
          placeholder="김링크"
        />
        <Label className={styles.Label} htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          className={styles.Input}
          name="email"
          type="email"
          placeholder="example@email.com"

        />
        <Label className={styles.Label} htmlFor="password">
          비밀번호
        </Label>
        <Input
          id="password"
          className={styles.Input}
          name="password"
          type="password"
          placeholder="비밀번호"
        />
        <Label className={styles.Label} htmlFor="passwordRepeat">
          비밀번호 확인
        </Label>
        <Input
          id="passwordRepeat"
          className={styles.Input}
          name="passwordRepeat"
          type="password"
          placeholder="비밀번호 확인"
        />
        <Button className={styles.Button}>회원가입</Button>

      </form>
    </>
  );
} 
