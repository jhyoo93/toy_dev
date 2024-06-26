import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import axios from '@/lib/movie/axios';
import { GetStaticProps } from 'next';

interface Props {
  movies: [] | undefined;
};

export const getStaticProps: GetStaticProps = async() =>  {
  const res = await axios.get('/movies/');
  const movies = res.data.results ?? [];
  return {
    props: { movies },
  };
}

export default function Home({ movies }: Props) {
  return (
    <>
      <MovieList className={styles.movieList} movies={movies}/>
    </>
  );
}

