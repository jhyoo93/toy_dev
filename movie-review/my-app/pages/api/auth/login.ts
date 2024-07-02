import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '../../../db/dbConnect';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { email, password } = req.body;
  
    try {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection('users').findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
  
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ token, user: { email: user.email, username: user.username } });
    } catch (error) {
        console.error('Error during login:', error);
        
        // Ensure error is typed properly
        if (error instanceof Error) {
          res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error', error: 'An unknown error occurred' });
        }
      }
  };
  
  export default handler;