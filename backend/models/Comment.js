import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    authorName: { type: String, required: true }, // 작성자 이름
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
