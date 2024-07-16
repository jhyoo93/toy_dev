import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/db/dbConnect';

export default async function name(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { movieId, username, comment } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase');
      const newComment = {
        movieId,
        username,
        comment,
        createdAt: new Date(),
      };

      await db.collection('comments').insertOne(newComment);
      return res.status(201).json({ message: '댓글이 저장되었습니다.' });
    } catch (error) {
      return res.status(500).json({ message: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.' });
    }
  } else if(req.method === 'GET') {
    const { movieId, page = 1, limit = 5 } = req.query;

    // if (!movieId) {
    //   return res.status(400).json({ message: 'movieId가 필요합니다.' });
    // }

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase');
      const skip = (Number(page) -1) * Number(limit);

      const comments = await db
        .collection('comments')
        .find({ movieId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray();

      const totalComments = await db
        .collection('comments')
        .countDocuments({ movieId });

       return res.status(200).json({ comments, totalPages: Math.ceil(totalComments / Number(limit)) });
    } catch (error) {
      console.error('댓글 불러오기 중 오류 발생:', error);
      return res.status(500).json({ message: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.' });
    }
    
  } else {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다' });
  }
}