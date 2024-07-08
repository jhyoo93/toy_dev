import styles from '../styles/MovieList.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Rating from "./Rating";
import { Movie } from "@/types/Movie";

interface MovieListItemProps {
  movie: Movie;
}

const MovieListItem = ({ movie }: MovieListItemProps) => {
    return (
      <li className={styles.movieListItem} key={movie.id}>
        <Link href={`/films/${movie.id}`}>
          <div className={styles.posterContainer}>
            <Image 
              fill 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              objectFit="cover"
            />
          </div>
        </Link>
        <div className={styles.info}>
          <h2 className={styles.title}>제목 : {movie.title}</h2>
          <h2 className={styles.title}>개봉일: {movie.release_date}</h2>
          <div className={styles.starRatingContainer}>
            평점 : <Rating value={Math.round(movie.vote_average / 2)} /> {/* 평점을 1~5로 변환 */}
          </div>
        </div>
      </li>
    );
};
export default MovieListItem;