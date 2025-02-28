import Post from "../models/Post.js";

import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';//로컬 RAM 메모리 안 쓰고 바로 S3로 업로드하게 수정정
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

//게시글 조회
const getPosts = async (category) => {
    const query = category ? { category } : {};
    return await Post.find(query)
    .populate("author", "name email")//작성자 정보 가져오기
    .sort({ createdAt: -1 });//최신순 정렬
};

// 이미지 저장 위한 AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY, // AWS 액세스 키
  secretAccessKey: process.env.AWS_PRIVATE_KEY, // AWS 비밀 키
  region: process.env.AWS_REGION, // S3 버킷이 위치한 리전
});

// 이미지 업로드 설정 multer-s3로 S3에 직접 업로드
const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // 업로드된 파일을 공개할지 여부
    key: (req, file, cb) => {
      const fileType = req.body.type || "others";
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${fileType}/${fileName}`);
    }
  })
});

//게시글 작성 및 저장(등록)
const createPost = async (title, content, category, contentAttachments, thumbnail, userId) => {
  const post = new Post({
    title,
    content,
    category,
    contentAttachments,
    thumbnail,
    author: userId,//userId는 Controller에서 req.user.id
  });
  return await post.save();
};

//특정 게시글 조회 페이지
const getPostById = async (id) => {
  return await Post.findById(id).populate("author", "name email");
};

const postService = { getPosts, createPost, getPostById, imageUpload };
export default postService;