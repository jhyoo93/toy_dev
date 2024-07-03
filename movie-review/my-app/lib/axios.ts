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