import { GetServerSideProps } from 'next';
import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import axios from '@/lib/movie/axios';  // axios를 사용
import { useState } from 'react';

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl: string;
}

interface HomeProps {
  initialReviews: Review[];
  initialOrder: string;
}

const Home = ({ initialReviews, initialOrder }: HomeProps) => {
  const [order, setOrder] = useState(initialOrder);

  const handleOrderChange = (newOrder: string) => {
    setOrder(newOrder);
  };

  return (
    <>
      <div className={styles.sorts}>
        <button
          className={`${styles.sortButton} ${order === 'createdAt' ? styles.sortButtonSelected : ''}`}
          onClick={() => handleOrderChange('createdAt')}
        >
          최신순
        </button>
        <button
          className={`${styles.sortButton} ${order === 'rating' ? styles.sortButtonSelected : ''}`}
          onClick={() => handleOrderChange('rating')}
        >
          베스트순
        </button>        
      </div>
      <MovieList initialReviews={initialReviews} order={order} className={styles.reviewList} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { order = 'createdAt' } = context.query; // 기본값을 'createdAt'으로 설정
  const url = `https://learn.codeit.kr/api/film-reviews?order=${order}&offset=0&limit=6`;
  console.log('Fetching initial reviews from URL:', url); // 요청 URL 로그
  try {
    const response = await axios.get(url);
    const initialReviews = response.data.reviews;

    return {
      props: {
        initialReviews,
        initialOrder: order,
      },
    };
  } catch (error) {
    console.error('Error fetching initial reviews:', error);
    return {
      props: {
        initialReviews: [],
        initialOrder: order,
      },
    };
  }
};

export default Home;