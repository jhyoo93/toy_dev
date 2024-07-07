import { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm, File as FormidableFile } from 'formidable';
import path from "path";
import fs from 'fs';

// Formidable 설정을 사용하여 파일을 처리
export const config = {
    api: {
      bodyParser: false, // Next.js의 기본 bodyParser를 사용하지 않음
    },
  };
  
const uploadDir = path.join(process.cwd(), 'public/uploads'); // 업로드된 파일을 저장할 디렉토리
  
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // 업로드 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
    });
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'File upload failed' });
      }
  
      const fileArray = files.file as FormidableFile[];
      const file = fileArray[0];
      const filePath = path.join('/uploads', path.basename(file.filepath));
  
      res.status(200).json({ filePath });
    });
};

export default handler;