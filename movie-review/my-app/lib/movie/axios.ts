import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!apiKey) {
  throw new Error('TMDB API key is not defined. Please add it to your .env.local file.');
}

const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
    api_key: apiKey,
  }
});

export default tmdbApi;

// const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY; cffe2e940e26194de2330166dbfa2ccf

// const axiosInstance = axios.create({
//   baseURL: 'http://www.omdbapi.com/', // 여기에 실제 API의 기본 URL을 입력합니다.
//   params: {
//     apikey: apiKey,
//   },
// });