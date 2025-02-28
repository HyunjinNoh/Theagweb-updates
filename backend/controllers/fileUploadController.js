
const uploadFile = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // 프론트엔드 도메인 허용
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // 허용할 메서드
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 허용할 헤더
  
    if (!req.file) {
    return res.status(400).json({ message: '파일이 제공되지 않았습니다.' });
  }

  res.status(200).json({ 
    message: '파일 업로드 성공', 
    fileUrl: req.file.location // multer-s3가 자동으로 업로드 URL 반환
  });
};

const fileUploadController = { uploadFile };
export default fileUploadController;