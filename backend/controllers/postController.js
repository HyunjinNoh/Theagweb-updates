import postService from "../services/postService.js";

//게시글 목록 조회
const getPosts = async (req, res) => {
    try {
      const posts = await postService.getPosts(req.query.category);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server error occurred while fetching posts.' });
    }
};

// CKEditor 본문 이미지 업로드
const uploadPostImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 제공되지 않았습니다." });
  }

  res.status(200).json({
    url: req.file.location, // CKEditor에서 자동 삽입할 이미지 URL
  });
};

// 썸네일 업로드
const uploadThumbnail = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "썸네일 이미지가 제공되지 않았습니다." });
  }

  res.status(200).json({
    message: "썸네일 업로드 성공",
    thumbnailUrl: req.file.location, // 썸네일 이미지 URL 반환
  });
};

//게시글 작성 및 저장(등록)
const createPost = async (req, res) => {
  const { title, content, category, attachments = [] } = req.body;

  const postImages = req.body.postImages || []; // Collect post images
  const thumbnail = req.body.thumbnail || ''; // Collect thumbnail

  const contentAttachments = [...attachments, ...postImages];

  // 요청 데이터 검증
  if (!title || !content || !category) {
    return res.status(400).json({ message: "제목, 내용, 카테고리는 필수로 입력해야 합니다다." });
  }

  try {
    const post = await postService.createPost(title, content, category, contentAttachments, thumbnail, req.user.id);
    res.status(201).json({ message: "게시글이 정상적으로 등록되었습니다.", post });
  } catch (error) {
    res.status(500).json({ message: "게시글 등록 오류" });
  }
};

//특정 게시글 조회 페이지
const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });

    //조회 시 조회수 증가
    post.views = (post.views || 0) + 1;
    await post.save();
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "해당 게시글을 불러오지 못했습니다." });
  }
};



const postController = { getPosts, createPost, getPostById, uploadPostImage, uploadThumbnail };
export default postController;