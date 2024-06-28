import axios from '../movie/axios';

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
  console.log('getReviews 함수 호출됨');
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const response = await axios.get(`/film-reviews?${query}`);
  if (response.status !== 200) {
    throw new Error('리뷰를 불러오는데 실패했습니다');
  }
  console.log('리뷰 데이터:', response.data);
  return response.data;
}
