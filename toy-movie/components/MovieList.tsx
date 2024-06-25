import styles from '@/styles/MovieList.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function MovieList({ className = '', movies }: any) {
  return (
    <ul className={`${styles.movieList} ${className}`}>
      {movies && movies.map((movie: any) => (
        <li key={movie.id}>
          <Link href={`/films/${movie.id}`}>
            <div className={styles.posterContainer}>
              <Image fill src={movie.posterUrl} alt={movie.title} />
            </div>
          </Link>

        </li>  
      ))}
    </ul>
  );
}