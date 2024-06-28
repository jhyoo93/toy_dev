import { useRouter } from 'next/router';

const useLocale = () => {
  const { locale } = useRouter();
  return locale || 'en';
};

export default useLocale;