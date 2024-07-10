import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import styles from '@/styles/Comments.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getUsernameFromToken } from '@/utils/auth';

interface CommentFormProps {
  movieId: string;
}

interface CommentFormData {
  username: string;
  comment: string;
}

const schema = yup.object().shape({
  username: yup.string().required('이름을 입력해주세요.'),
  comment: yup.string().required('댓글을 입력해주세요.'),
});

const CommentForm = ({ movieId }: CommentFormProps) => {
  const [username, setUsername] = useState<string>('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CommentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      comment: '',
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const fetchedUsername = getUsernameFromToken(token);
      if (fetchedUsername) {
        setUsername(fetchedUsername);
        setValue('username', fetchedUsername);
        console.log('Fetched Username:', fetchedUsername);  // 디버깅 로그
      }
    }
  }, [setValue]);

  const mutation = useMutation(
    (newComment: CommentFormData) => axios.post('/api/comments', { movieId, ...newComment }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', movieId]);
        alert('댓글이 저장되었습니다.');
      },
      onError: (error) => {
        alert('댓글 저장 중 오류가 발생했습니다.');
        console.error(error);
      },
    }
  );

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <label>이름</label>
        <input 
          {...register('username')} 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          readOnly 
        />
        {errors.username && <p className={styles.error}>{errors.username.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>댓글</label>
        <textarea {...register('comment')} />
        {errors.comment && <p className={styles.error}>{errors.comment.message}</p>}
      </div>
      <button type="submit">댓글 작성</button>
    </form>
  );
};

export default CommentForm;