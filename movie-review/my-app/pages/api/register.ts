import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '@/db/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, email, phone } = req.body;
  console.log('수신된 요청 데이터:', req.body); // 요청 데이터 출력

  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: '모든 정보를 입력해 주세요.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').insertOne(newUser);

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.' });
  }
}