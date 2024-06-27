import { GetServerSideProps } from 'next';
import { getReviews } from '@/lib/movie/reviews';
import styles from '@/styles/MovieList.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface MovieListProps {
  reviews: Review[];
  className?: string;
}

const MovieList: React.FC<MovieListProps> = ({  reviews, className = '' }) => {
  return (
    <ul className={`${styles.movieList} ${className}`}>
      {reviews && reviews.map((item: any) => (
        <li key={item.id}>
          <Link href={`/films/${item.id}`}>
            <div className={styles.posterContainer}>
              <Image fill src={item.imgUrl} alt={item.title} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const reviews = await getReviews({ limit: 6 }); // 필요한 파라미터를 설정합니다.
    return {
      props: {
        reviews,
        className: '', // 필요한 클래스 네임을 여기에 설정합니다.
      },
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);

    return {
      props: {
        reviews: [],
        className: '',
      },
    };
  }
};

export default MovieList;