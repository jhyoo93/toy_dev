import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File as FormidableFile } from 'formidable';
import path from "path";
import fs from 'fs';
import User from '@/models/User';
import mongoose from 'mongoose';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('업로드 API 호출됨');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('폼 파싱 오류:', err);
      return res.status(500).json({ message: '파일 업로드 실패' });
    }

    try {
      const fileArray = files.file as FormidableFile[];
      const file = fileArray[0];
      const filePath = path.join('/uploads', path.basename(file.filepath)).replace(/\\/g, '/');

      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.error('MONGODB_URI가 정의되지 않음');
        return res.status(500).json({ message: 'MONGODB_URI가 정의되지 않음' });
      }

      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }

      const userIdField = fields.userId;
      if (!userIdField) {
        console.error('사용자 ID가 제공되지 않음');
        return res.status(400).json({ message: '사용자 ID가 제공되지 않음' });
      }

      let userId: string;
      if (Array.isArray(userIdField)) {
        userId = userIdField[0];
      } else {
        userId = userIdField;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('유효하지 않은 사용자 ID:', userId);
        return res.status(400).json({ message: '유효하지 않은 사용자 ID' });
      }

      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { image: filePath } }
      );
      console.log('이미지 경로 데이터베이스에 저장됨:', filePath);
      res.status(200).json({ filePath });
    } catch (error) {
      console.error('서버 처리 오류:', error);
      res.status(500).json({ message: '서버 처리 중 오류 발생' });
    }
  });
};

export default handler;