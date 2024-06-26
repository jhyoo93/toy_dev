import styles from '@/styles/MovieList.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  className?: string;
  movies: [] | undefined;
};

export default function MovieList({ className = '', movies }: Props) {
  return (
    <ul className={`${styles.movieList} ${className}`}>
      {movies && movies.map((movie: any) => (
        <li key={movie.id}>
          <Link href={`/films/${movie.id}`}>
            <div className={styles.posterContainer}>
              <Image fill src={movie.posterUrl} alt={movie.title} />
            </div>
          </Link>
          <div className={styles.info}>
            <h2 className={styles.title}>{movie.title}</h2>
            <div className={styles.date}>
              {movie.date} ・ {movie.country}
            </div>
            <div className={styles.starRatingContainer}>
              <span className={styles.starRating}>{movie.starRating}</span>
            </div>
          </div>
        </li>  
      ))}
    </ul>
  );
}