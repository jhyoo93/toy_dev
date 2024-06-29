import { GetServerSideProps } from 'next';
import SearchForm from "@/components/SearchForm";
import MovieList from "@/components/MovieList";
import { Movie } from "@/types/Movie";
import styles from '@/styles/SearchForm.module.css';
import Head from "next/head";
import axios from 'axios';
import { useState } from 'react';

interface SearchProps {
  q: string;
  initialMovies: Movie[];
}

// 초기 데이터
export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {

  const { q } = context.query;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!q) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  let initialMovies: Movie[] = [];
  
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: apiKey,
        query: q,
        language: 'ko-KR',
        page: 1,
      },
    });
    initialMovies = response.data.results.slice(0, 9); // 검색후 처음 가져올 페이지개수

  } catch (error) {
    console.error('Error fetching search results:', error);
  }

  return {
    props: {
      q: q as string,
      initialMovies,
    },
  };
};

const Search = ({ q, initialMovies }: SearchProps) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreMovies = async () => {
    setLoading(true);
    console.log('Loading more movies...');
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
          query: q,
          language: 'ko-KR',
          page: page,
        },
      });
      console.log('Response:', response);
      const newMovies: Movie[] = response.data.results.slice(0, 9); // 다음 9개의 영화를 가져옵니다.
      console.log('New movies:', newMovies);
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
      <Head>
        <title>{q} 검색 결과 - MOVIE</title>
      </Head>
      <h1 className={styles.title}>
        <span className={styles.keyword}>[ {q} ]</span> 검색 결과
      </h1>
      <div className={styles.searchContainer}>
        <SearchForm initialValue={q} />
      </div>
      <MovieList movies={movies} />
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

export default Search;
