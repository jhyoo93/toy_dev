import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '../../../db/dbConnect';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { username: user.username, email: user.email } });

  } catch (error) {
    console.error('로그인 중 에러 발생:', error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다. 잠시후 다시 시도해 주세요.'  });
  }
}