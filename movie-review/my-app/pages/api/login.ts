import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function connectToDatabase(uri: string) {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }

  const client = await connectToDatabase(process.env.MONGODB_URI!);
  const db = client.db();

  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(401).json({ message: '유효하지 않은 이메일입니다.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: '유효하지 않은 비밀번호입니다.' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, user: { id: user._id, email: user.email, username: user.username } });
}