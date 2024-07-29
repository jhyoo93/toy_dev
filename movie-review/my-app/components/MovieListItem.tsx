import styles from '../styles/MovieList.module.css';
import Image from 'next/image';
import Rating from './Rating';
import { Movie } from '@/types/Movie';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/useAuthStore';

interface MovieListItemProps {
  movie: Movie;
}

const MovieListItem = ({ movie }: MovieListItemProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault();
      alert('로그인이 필요합니다.');
    } else {
      router.push(`/films/${movie.id}`);
    }
  };

  return (
    <li key={movie.id}>
      <a href={`/films/${movie.id}`} onClick={handleClick}>
          <div className={styles.posterContainer}>
            <Image 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              layout="fill"
              objectFit="cover"
            />
          </div>
      </a>
      <div className={styles.info}>
        <h2 className={styles.title}>제목 : {movie.title}</h2>
        <h2 className={styles.title}>개봉일: {movie.release_date}</h2>
        <div className={styles.starRatingContainer}>
          평점 : <Rating value={Math.round(movie.vote_average)} />
        </div>
      </div>
    </li>
  );
};

export default MovieListItem;
