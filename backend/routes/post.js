import express from "express";
import { verifyReporter } from "../middleware/verifyReporter.js";
import Post from "../models/Post.js";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config(); // .env 파일 로드

const router = express.Router();

// 게시글 작성 라우트
router.post("/", verifyReporter, async (req, res) => {
  const { title, content, category, attachments = [] } = req.body;

  // 요청 데이터 검증
  if (!title || !content || !category) {
    return res.status(400).json({ message: "Title, content, and category are required." });
  }

  try {
    // 새로운 게시글 생성
    const post = new Post({
      title,
      content,
      category,
      attachments,
      author: req.user.id, // 토큰에서 추출된 사용자 ID
    });

    // 데이터베이스에 저장
    await post.save();
    res.status(201).json({ message: "Post created successfully!", post });
  } catch (error) {
    console.error("Error creating post:", error);

    // MongoDB 유효성 검사 오류 처리
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data.", details: error.message });
    }

    res.status(500).json({ message: "Error creating post." });
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
router.post('/upload', upload.single('upload'), async (req, res) => {
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

// 게시글 목록 조회 라우트
router.get("/", async (req, res) => {
  

  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const posts = await Post.find(query).sort({ createdAt: -1 }); // 최신순 정렬
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

router.get("/search", async (req, res) => {
  const { keyword, filterBy } = req.query;

  try {
    let query = {};

    // 검색 조건 검증
    if (keyword) {
      if (filterBy === "title") {
        query.title = { $regex: keyword, $options: "i" }; // 제목 기준 필터
      } else if (filterBy === "author") {
        query = { "author.name": { $regex: keyword, $options: "i" } }; // 작성자 기준 필터
      } else {
        // filterBy 값이 title 또는 author가 아니면 400 오류 반환
        return res.status(400).json({ message: "Invalid value." });
      }
    }

    const posts = await Post.find(query).populate("author", "name").sort({ createdAt: -1 });

    if (posts.length === 0) {
      // 검색 결과가 없으면 404 반환
      return res.status(404).json({ message: "No posts found matching your criteria." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Error searching posts." });
  }
});

// 특정 게시글 조회 라우트
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 조회수 증가
    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post." });
  }
});

router.patch("/:id/views", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // 조회수 증가
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ message: "Error updating views." });
  }
});

//게시글 수정
router.put("/:id", verifyReporter, async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: "Title, content, and category are required." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 작성자 확인
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update this post." });
    }

    // 게시글 업데이트
    post.title = title;
    post.content = content;
    post.category = category;
    await post.save();

    res.status(200).json({ message: "Post updated successfully!", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post." });
  }
});




export default router;
