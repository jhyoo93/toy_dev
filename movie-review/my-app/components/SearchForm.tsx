import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@/styles/SearchForm.module.css';

interface SearchFormProps {
    initialValue?: string;
}

export default function SearchForm({ initialValue = '' }: SearchFormProps) {
    const [value, setValue] = useState(initialValue);
    const router = useRouter();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value.trim() !== '') {
        router.push(`/search?q=${value}`);
      } else {
        router.push('/'); // 검색어가 없으면 메인 페이지로 리다이렉트
      }
    };

    return (
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="q"
            value={value}
            placeholder="영화를 검색해보세요"
            onChange={handleChange}
          />
          <button className={styles.button} type="submit">검색</button>
        </form>
    );
}