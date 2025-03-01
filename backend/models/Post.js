import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    issue: { 
      type: Number, 
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    page: {
      type: Number, 
      required: true 
    },
    previewSentence: { 
      type: String, 
      required: true 
    },
    thumbnailImage: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      default: "6743aa4d65d9e2ef0b0949b4",
      ref: "User", 
    }, // User 모델과 연결
    views: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true } // createdAt, updatedAt 자동 생성
);

export default mongoose.model("Post", postSchema);
