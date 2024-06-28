import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Review } from '@/types/Review'; // 경로를 실제 파일 경로로 수정하세요
import styles from '@/styles/FilmDetail.module.css';
import { ParsedUrlQuery } from 'querystring';
import Rating from '@/components/Rating';

interface FilmDetailProps {
  film: Review;
}

interface Params extends ParsedUrlQuery {
    id: string;
  }

const FilmDetail = ({ film }: FilmDetailProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{film.title}</h1>
      <img src={film.imgUrl} alt={film.title} className={styles.image} />
      <p className={styles.date}>{new Date(film.createdAt).toLocaleDateString()}</p>
      <p className={styles.content}>{film.content}</p>
      <div className={styles.rating}>
        <Rating value={film.rating} />{film.rating} / 5
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const url = `https://learn.codeit.kr/api/film-reviews?id=${id}`;

  try {
    const response = await axios.get(url);
    const film: Review = response.data.reviews.find((review: Review) => review.id.toString() === id);

    if (!film) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        film,
      },
    };
  } catch (error) {
    console.error('Error fetching film details:', error);
    return {
      notFound: true,
    };
  }
};

export default FilmDetail;