import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Movie } from '@/types/Movie'; 
import styles from '@/styles/Movie.module.css';
import commentStyles from '@/styles/Comments.module.css';
import listStyles from '@/styles/CommentList.module.css';
import Rating from '@/components/Rating';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import cookie from 'cookie';

interface FilmDetailProps {
  movie: Movie | null;
  error?: string;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const { id } = params as Params;

  // 쿠키에서 토큰을 가져옴
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.authToken;

  // 토큰이 없거나 유효하지 않으면 메인 페이지로 리다이렉트.
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // API 호출하여 영화 데이터를 가져옴.
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  let movie = null;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: apiKey,
        language: 'ko-KR',
      },
    });
    movie = response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }

  return {
    props: {
      movie,
      error: movie ? null : '영화 정보를 불러오지 못했습니다.',
    },
  };
};

const FilmDetail = ({ movie, error }: FilmDetailProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      alert(error);
      router.replace('/');
    }
  }, [error, router]);

  if (!movie) {
    return null;
  }

  const goList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.posterContainer}>
          <Image 
            fill 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
          />           
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>
          <hr/>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <th>개봉일</th>    
                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>소개</th>    
                <td>{movie.overview}</td>
              </tr>
              <tr>
                <th>별점</th>    
                <td>
                  <Rating value={Math.round(movie.vote_average / 2)} />&nbsp;&nbsp;
                  {movie.vote_average.toString().substring(0, 3)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>    
      <br/><br/>
      <div className={styles.goList}>
          <button className={styles.listButton} onClick={goList}>메인으로</button>
          <button className={styles.listButton} onClick={() => setIsModalOpen(true)}>리뷰 작성</button>
      </div>
      <br/><br/>
      <div className={listStyles.commentListContainer}>
        <CommentList movieId={movie.id.toString()} />
      </div>
      <div className={commentStyles.commentFormContainer}>
        <CommentForm movieId={movie.id.toString()} isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}/>
      </div>
      
    </div>
  );
};

export default FilmDetail;
