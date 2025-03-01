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


//특정 게시글 조회 페이지
const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.postId);
    if (!post) return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });

    //조회 시 조회수 증가
    post.views = (post.views || 0) + 1;
    await post.save();
    
    res.status(200).json(post);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "해당 게시글을 불러오지 못했습니다." });
  }
};

const postController = { getPosts, getPostById};
export default postController;