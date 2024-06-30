import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '@/db/dbConnect';

type Data = {
    message: string;
  };
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) { 
    // 405 에러
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { username, password, email, phone } = req.body;
    
    // 400 에러
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      const client = await clientPromise;
      const db = client.db('mydatabase');
  
      const user = await db.collection('users').findOne({ $or: [{ username }, { email }, { phone }] });
  
      if (user) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await db.collection('users').insertOne({
        username,
        password: hashedPassword,
        email,
        phone,
      });
  
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}