import express from "express";
import { verifyReporter } from "../middleware/verifyReporter.js";
import postController from "../controllers/postController.js";

/*파일 등록 관련 부분*/
import Post from "../models/Post.js";
import AWS from 'aws-sdk';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드
/*여기까지 분리 못함*/

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - 게시글
 *     summary: 게시글 목록 조회
 *     description: 게시글 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 게시글 목록을 성공적으로 조회했습니다.
 *       404:
 *         description: 게시글이 없습니다.
 */
router.get("/", postController.getPosts);

/*여기부터 service, controller, routes 분리 못함*/
// 게시글 작성 라우트
router.post("/", verifyReporter, async (req, res) => {
    const { title, issue, publicationDate, page, content, category, previewSentence, thumbnailImage } = req.body;
  
    // 요청 데이터 검증
    if (!content) {
      return res.status(400).json({ message: "내용이 비어있습니다." });
    }
  
    try {
      // 새로운 게시글 생성
      const post = new Post({
        title, 
        issue, 
        publicationDate,
        page,
        category, 
        previewSentence, 
        thumbnailImage,
        content,   
        author: req.user._id, // verifyReporter 토큰에서 추출된 사용자 ID
      });
  
      // 데이터베이스에 저장
      await post.save();
      res.status(201).json({ message: "기사가 정상적으로 등록되었습니다.", post });
    } catch (error) {
      console.error("Error creating post:", error);
  
      // MongoDB 유효성 검사 오류 처리
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data.", details: error.message });
      }
  
      res.status(500).json({ message: "기사 등록 오류" });
    }
  });
  
  // AWS S3 설정
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY, // AWS 액세스 키
    secretAccessKey: process.env.AWS_PRIVATE_KEY, // AWS 비밀 키
    region: process.env.AWS_REGION, // S3 버킷이 위치한 리전
  });
  
  // Multer 설정
  const storage = multer.memoryStorage(); // 메모리 저장소 사용
  const upload = multer({ storage });
  
  // 이미지 업로드 엔드포인트
  router.post('/postImages', upload.single('upload'), async (req, res) => { 
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // 프론트엔드 도메인 허용
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // 허용할 메서드
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 허용할 헤더
    
    try {
      console.log("Upload request received:", req.file); // 요청 파일 확인
  
      if (!req.file) {
        console.error("No file provided");
        return res.status(400).json({ uploaded: false, error: "No file provided" });
      }
  
      const fileName = `${Date.now()}_${req.file.originalname}`;
      console.log("Uploading file:", fileName);
  
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // S3 버킷 이름
        Key: `upload/${fileName}`,          // 파일 경로 (upload 폴더 안에 저장)
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
  
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully:", data.Location);
  
      res.status(200).json({
        uploaded: true, // 업로드 성공 여부
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/upload/${fileName}`, // 업로드된 URL
      });
    } catch (err) {
      console.error("Error during file upload:", err.message);
      res.status(500).json({ uploaded: false, error: err.message });
    }
  });
/*여기까지 service, controller, routes 분리 못함. */

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     tags:
 *       - 게시글
 *     summary: 특정 게시글 조회
 *     description: 특정 게시글의 세부 내용을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글을 성공적으로 조회했습니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/:postId", postController.getPostById);

// 특정 게시글 수정, 삭제 추가해야 함. 

export default router;
