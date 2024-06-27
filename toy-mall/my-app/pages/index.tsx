import { GetServerSideProps } from 'next';
import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import axios from '@/lib/movie/axios';  // axios를 사용

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl: string;
}

interface Props {
  initialReviews: Review[];
}
const Home: React.FC<Props> = ({ initialReviews }) => {
  return (
    <>
      <MovieList initialReviews={initialReviews} className={styles.movieList} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('getServerSideProps 함수 호출됨');
  try {
    const response = await axios.get('/film-reviews?limit=6&page=1');  // axios로 API 호출
    const data = response.data;

    // data.reviews가 배열인지 여부를 검사
    const initialReviews = Array.isArray(data.reviews) ? data.reviews : [];
    return {
      props: {
        initialReviews,
      },
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      props: {
        initialReviews: [],
      },
    };
  }
};

export default Home;