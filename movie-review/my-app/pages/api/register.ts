import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '@/db/dbConnect';

const saltRounds = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password, email, phone } = req.body;

  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    const usersCollection = db.collection('users');

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdAt = new Date();
    const updatedAt = new Date();

    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      email,
      phone,
      createdAt,
      updatedAt,
    });

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}