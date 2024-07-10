import { useMutation, UseMutationResult, useQuery, UseQueryResult, QueryClient  } from 'react-query';
import axios from 'axios';

const queryClient = new QueryClient();

export const useRegister = (): UseMutationResult<any, unknown, any, unknown> => {
  return useMutation((userData: any) => axios.post('/api/register', userData), {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    },
  });
};

export const useLogin = (): UseMutationResult<any, unknown, any, unknown> => {
  return useMutation((loginData: any) => axios.post('/api/login', loginData), {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    },
  });
};

export const useComments = (movieId: string): UseQueryResult<any, unknown> => {
  return useQuery(['comments', movieId], async () => {
    const response = await axios.get(`/api/comments/${movieId}`);
    return response.data;
  });
};

export default queryClient;