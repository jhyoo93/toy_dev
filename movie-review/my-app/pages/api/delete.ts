import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '@/models/User';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('삭제 API 호출됨');
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  }

  const { filePath, userId } = req.body;

  if (!filePath || !userId) {
    return res.status(400).json({ message: '파일 경로와 사용자 ID가 필요합니다' });
  }

  const absolutePath = path.join(process.cwd(), 'public', filePath);

  try {
    fs.unlinkSync(absolutePath);
    console.log('파일 삭제됨:', absolutePath);

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI가 정의되지 않음');
      return res.status(500).json({ message: 'MONGODB_URI가 정의되지 않음' });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('유효하지 않은 사용자 ID:', userId);
      return res.status(400).json({ message: '유효하지 않은 사용자 ID' });
    }

    try {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $unset: { image: "" } }
      );
      console.log('이미지 경로 데이터베이스에서 제거됨');
    } catch (error) {
      console.error('데이터베이스 업데이트 오류:', error);
      return res.status(500).json({ message: '데이터베이스에서 이미지 경로 제거 실패' });
    } 

    res.status(200).json({ message: '파일이 성공적으로 삭제되었습니다' });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    res.status(500).json({ message: '파일 삭제 실패', error });
  }
};

export default handler;
