import styles from '@/styles/MovieList.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTranslate from '@/hooks/useTranslate';
import MovieListItem from '@/components/MovieListItem';
import { Review } from '@/types/Review';

interface MovieListProps {
  initialReviews: Review[];
  order: string;
  className?: string;
}

const MovieList: React.FC<MovieListProps> = ({ initialReviews, order, className = '' }) => {
  const t = useTranslate();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (offset: number, limit: number, order: string) => {
    const url = `https://learn.codeit.kr/api/film-reviews?order=${order}&offset=${offset}&limit=${limit}`;
    console.log('Fetching reviews from URL:', url); // 요청 URL 로그
    try {
      const response = await axios.get(url);
      console.log('API Response:', response); // API 응답 로그
      return response.data.reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newReviews = await fetchReviews(reviews.length, 6, order);
      console.log('Loaded reviews:', newReviews); // API 응답 데이터 확인
      if (newReviews.length > 0) { //가져온 데이터가 0보다 클때 더보기
        setReviews((prevReviews) => [...prevReviews, ...newReviews]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const initialReviews = await fetchReviews(0, 6, order);
        setReviews(initialReviews);
      } catch (error) {
        console.error('Error during initial fetch:', error);
      }
    })();
  }, [order]);

  return (
    <div className={className}>
      <ul className={`${styles.movieList} ${className}`}>
        {reviews && reviews.map((item) => (
          <MovieListItem
            key={item.id}
            item={item}
          />
        ))}
      </ul>
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button onClick={handleLoadMore} disabled={loading} className={styles.loadMoreButton}>
            {loading ? 'Loading...' : t('load more')} 
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieList;