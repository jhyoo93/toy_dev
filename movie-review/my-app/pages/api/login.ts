import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../db/dbConnect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // request요청이 POST 가 아닐때
  if (req.method !== 'POST') {
     res.setHeader('Allow', ['POST']);
     return res.status(405).end(`Method ${req.method} Not Allowed`); 
  }

  // form태그 body 데이터 변수
  const { email, password } = req.body;

  // 이메일 또는 패스워드가 값이없을때
  if(!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try { 
    const client = await clientPromise; // dbConnect 연동
    const db = client.db('mydatabase'); // 데이터베이스명 입력
    const user = await db.collection('users').findOne({ email }); // collection명 입력후 emial값으로 회원 조회

    // user 변수에 담긴 조회 데이터가 빈값 일때
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
     
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 패스워드가 일치하지 않을때
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({  
      userId: user._id, email: user.email 
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }

    );

    res.status(200).json({ token });

  } catch(e) {
    console.error('Error during login:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

}