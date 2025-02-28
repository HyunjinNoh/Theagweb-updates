import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';//로컬 RAM 메모리 안 쓰고 바로 S3로 업로드하게 수정정
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY, // AWS 액세스 키
  secretAccessKey: process.env.AWS_PRIVATE_KEY, // AWS 비밀 키
  region: process.env.AWS_REGION, // S3 버킷이 위치한 리전
});

// 파일 업로드 설정 multer-s3로 S3에 직접 업로드
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // 업로드된 파일을 공개할지 여부
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `upload/${fileName}`);
    }
  })
});

const fileUploadService = { upload };
export default fileUploadService;