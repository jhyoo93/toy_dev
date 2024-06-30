import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '@/db/dbConnect';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, username, password, phone } = req.body
  
    if (!email || !username || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('mydatabase');

      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        email,
        username,
        password: hashedPassword,
        phone,
      };

      const result = await db.collection('users').insertOne(user);
      res.status(201).json({ message: 'User created', result });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error });
    }
}