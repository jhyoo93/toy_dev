import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/MovieList.module.css';
import Rating from '@/components/Rating';
import { useState } from 'react';
import axios from 'axios';
import useTranslate from '@/hooks/useTranslate';

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl: string;
  rating: number;
}

interface MovieListProps {
  initialReviews: Review[];
  className?: string;
}

const MovieList: React.FC<MovieListProps> = ({ initialReviews, className = '' }) => {
  const t = useTranslate();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/reviews?page=${page + 1}`);
      const newReviews = response.data.reviews;
      if (newReviews.length > 0) {
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


  function formatDate(value: string) {
    const date = new Date(value);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  }

  return (
    <div>
      <ul className={`${styles.movieList} ${className}`}>
        {reviews && reviews.map((item) => (
          <li key={item.id}>
            <Link href={`/films/${item.id}`}>
              <div className={styles.posterContainer}>
                <Image fill src={item.imgUrl} alt={item.title} />
              </div>
            </Link>
            <div className={styles.info}>
              <h2 className={styles.title}>{item.title}</h2>
              <div className={styles.date}>
                {formatDate(item.createdAt)}
              </div>
              <div className={styles.starRatingContainer}>
                <Rating value={item.rating} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={handleLoadMore} disabled={loading} className={styles.loadMoreButton}>
          {loading ? 'Loading...' : t('load more')}
        </button>
      )}
    </div>
  );
}

export default MovieList;