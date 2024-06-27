import axios from '@/lib/movie/axios';

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface GetReviewsParams {
  order?: string;
  offset?: number;
  limit?: number;
}

export async function getReviews({
  order = 'createdAt',
  offset = 0,
  limit = 6,
}: GetReviewsParams): Promise<Review[]> {
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const response = await axios.get(`/film-reviews?${query}`);
  if (response.status !== 200) {
    throw new Error('리뷰를 불러오는데 실패했습니다');
  }
  return response.data;
}