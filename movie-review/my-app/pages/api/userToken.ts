import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import clientPromise from '@/db/dbConnect';
import { ObjectId } from 'mongodb';

type Data = {
    user?: any;
    message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const client = await clientPromise;
      const db = client.db();
  
      const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error verifying token or fetching user:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
}