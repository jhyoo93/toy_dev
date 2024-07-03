import { useMutation, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

const queryClient = new QueryClient();

const useRegister = () => {
  return useMutation((userData: any) => axios.post('/api/register', userData));
};

const useLogin = () => {
  return useMutation((loginData: any) => axios.post('/api/login', loginData));
};

export { queryClient, QueryClientProvider, useRegister, useLogin };