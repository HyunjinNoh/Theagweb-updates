import Post from "../models/Post.js";

//게시글 조회
const getPosts = async (category) => {
    const query = category ? { category } : {};
    return await Post.find(query)
    .populate("author", "name email")//작성자 정보 가져오기
    .sort({ createdAt: -1 });//최신순 정렬
};

//특정 게시글 조회 페이지
const getPostById = async (id) => {
  return await Post.findById(id).populate("author", "name email");
};

const postService = { getPosts, getPostById };
export default postService;