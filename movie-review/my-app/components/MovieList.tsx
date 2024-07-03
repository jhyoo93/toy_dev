import styles from '@/styles/MovieList.module.css';
import MovieListItem from '@/components/MovieListItem';
import { Movie } from '@/types/Movie';

interface MovieListProps {
  movies: Movie[];
  className?: string;
}

const MovieList = ({ movies, className = '' }: MovieListProps) => {

  return (
    <div className={className}>
      <ul className={`${styles.movieList} ${className}`}>
        {movies && movies.map((movie) => (
          <MovieListItem key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  );
}

export default MovieList;