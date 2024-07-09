import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Movie } from '@/types/Movie'; 
import styles from '@/styles/Movie.module.css';
import Rating from '@/components/Rating';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { MouseEvent } from 'react';

interface FilmDetailProps {
  movie: Movie;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
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
    },
  };
};

const FilmDetail = ({ movie }: FilmDetailProps) => {

  const router = useRouter();

  if (!movie) {
    return <div>영화 정보를 찾을 수 없습니다.</div>;
  }

  function goList(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    router.push('/');
  }  
 

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
                        {movie.vote_average} / 10
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>
      <br/><br/><br/><br/>
      댓글 추가 예정
      <div>
        <button className={styles.listButton} onClick={goList}>목록으로</button>
      </div>
    </div>
  );
};


export default FilmDetail;