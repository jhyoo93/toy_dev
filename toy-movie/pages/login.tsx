import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useSetLocale, useTranslate } from '@/components/Translate';
import '@/styles/Login.module.css';

function App() {

  // useState에서는 타입 추론이 잘되지만 안될경우 명시적으로 선언해준다.<>제네릭 사용
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  // HTML <form> 사용시 초기값 null로 맞춰주면됨.
  const formRef = useRef<HTMLFormElement>(null);

  const t = useTranslate();
  const setLocale = useSetLocale();

  useEffect(() => {
    const form = formRef.current;
    if (form) form['username'].focus();
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    const nextValues = {
      ...values,
      [name]: value,
    };
    setValues(nextValues);
  }

  function handleClick(e: any) {
    e.preventDefault();

    const message = `${values.username}님 환영합니다`;
    alert(message);
  }

  return (
    <form className="login" ref={formRef}>
      <h1 className="login-title">{t('signin')}</h1>
      <Label>{t('username')}</Label>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder={t('email or phone number')}
        value={values.username}
        onChange={handleChange}
      />
      <Label>{t('password')}</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder={t('password')}
        value={values.password}
        onChange={handleChange}
      />
      <div className="login-forgot">
        <a className="login-forgot-link" href="#login">
          {t('forgot your password?')}
        </a>
      </div>
      <Button id="submit" onClick={handleClick}>
        {t('signin')}
      </Button>
      <div className="login-signup">
        {t('new user?')}{' '}
        <a className="login-signup-link" href="#signup">
          {t('signup')}
        </a>
      </div>
      <div className="locale">
        <span onClick={() => setLocale('ko')}>한국어</span> |{' '}
        <span onClick={() => setLocale('en')}>English</span>
      </div>
    </form>
  );
}

export default App;
