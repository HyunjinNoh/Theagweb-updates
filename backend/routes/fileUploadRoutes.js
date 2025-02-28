import express from 'express';
import fileUploadService from '../services/fileUploadService.js';
import fileUploadController from '../controllers/fileUploadController.js';

const router = express.Router();

// 파일 업로드 라우트 (아직은 이미지만)
router.post('/upload', fileUploadService.upload.single('file'), fileUploadController.uploadFile);

// 파일 삭제 라우트 (아직은 이미지만)

export default router;
