import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import axios from '@/lib/axios';


export async function getStaticProps() {
  const res = await axios.get('/movies/');
  const movies = res.data.results ?? [];
  return {
    props: { movies },
  };
}

export default function Home({ movies }: any) {
  return (
    <>
      <MovieList className={styles.movieList} movies={movies}/>
    </>
  );
}

