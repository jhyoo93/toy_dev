import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import axios from '@/lib/movie/axios';
import { GetStaticProps } from 'next';

interface Props {
  movies: [] | undefined;
};


export default function Home({ movies }: Props) {
  return (
    <>
      <MovieList className={styles.movieList} movies={movies} />
    </>
  );
}
