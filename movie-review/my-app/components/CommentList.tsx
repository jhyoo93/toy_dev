import { useQuery } from 'react-query';
import axios from 'axios';
import styles from '@/styles/CommentList.module.css';
import { useState } from 'react';

interface Comment {
  _id: string;
  username: string;
  comment: string;
  createdAt: string;
}

interface CommentListProps {
  movieId: string;
}

const fetchComments = async (movieId: string, page: number) => {
  const response = await axios.get(`/api/comments`, { params: { movieId, page, limit: 5 } });
  return response.data;
};

const CommentList = ({ movieId }: CommentListProps) => {
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useQuery(['comments', movieId, page], () => fetchComments(movieId, page), {
    keepPreviousData: true,
  });

  if (isLoading){
    return <div>로딩 중...</div>;
  } 
  if (error) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <div className={styles.commentList}>
        <h2>리뷰 리스트</h2>
        {comments.length > 0 ? (
            comments.map((comment: Comment) => (
              <div key={comment._id} className={styles.comment}>
                <p><strong>{comment.username}</strong></p>
                <p>{comment.comment}</p>
                <p>{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
          <div className={styles.noComments}>첫 번째 리뷰를 작성해보세요!</div>
        )} 
      </div>
      <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_id, i) => i + 1).map((pageNum) => (
        <button key={pageNum} disabled={pageNum === page} onClick={() => setPage(pageNum)}>
          {pageNum}
        </button>
      ))}
    </div><br/>
  </div>  
  );

};

export default CommentList;