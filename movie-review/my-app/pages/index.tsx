import { GetServerSideProps } from 'next';
import MovieList from '@/components/MovieList';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { Movie } from '@/types/Movie';
import SearchForm from '@/components/SearchForm';
import tmdbApi from '@/lib/movie/axios';
import Head from 'next/head';

interface HomeProps {
  initialMovies: Movie[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await tmdbApi.get('/movie/popular', {
    params: {
      language: 'ko-KR',
      page: 1,
    },
  });

  const initialMovies = response.data.results.slice(0, 9);

  return {
    props: {
      initialMovies,
    },
  };
};


const Home = ({ initialMovies }: HomeProps) => {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreMovies = async () => {
    setLoading(true);
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: {
          language: 'ko-KR',
          page: page,
        },
      });
      const newMovies = response.data.results.slice(0, 9);
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies: Movie[]) => [...prevMovies, ...newMovies]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more movies:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.searchResult}>
        <Head>
          <title>영화 - MOVIE</title>
        </Head>
      </div>
      <div className={styles.searchContainer}>
        <SearchForm/>
      </div>
      <MovieList movies={movies} className={styles.reviewList} />
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button onClick={loadMoreMovies} disabled={loading} className={styles.loadMoreButton}>
            {loading ? '로딩 중...' : '더보기'}
          </button>
        </div>
      )}
    </>
  );
};


export default Home;