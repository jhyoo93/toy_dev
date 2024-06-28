import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://learn.codeit.kr/api', // 여기에 실제 API의 기본 URL을 입력합니다.
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;