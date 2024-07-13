import { useQuery } from 'react-query';
import axios from 'axios';
import styles from '@/styles/CommentList.module.css';

interface Comment {
  _id: string;
  username: string;
  comment: string;
  createdAt: string;
}

interface CommentListProps {
  movieId: string;
}

const fetchComments = async (movieId: string) => {
  const response = await axios.get(`/api/comments?movieId=${movieId}`);
  return response.data;
};

const CommentList = ({ movieId }: CommentListProps) => {
  const { data: comments, error, isLoading } = useQuery<Comment[]>(['comments', movieId], () => fetchComments(movieId));

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className={styles.commentList}>
      {comments && comments.map((comment) => (
        <div key={comment._id} className={styles.comment}>
          <p className={styles.date}><strong>{comment.username}</strong></p>
          <p className={styles.date}>{comment.comment}</p>
          <p className={styles.date}>{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );

};

export default CommentList;