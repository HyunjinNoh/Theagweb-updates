import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // User 모델과 연결
    category: { 
      type: String, 
      required: true 
    },
    attachments: [{ 
      type: String 
    }], // 파일 URL 배열
    views: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true } // createdAt, updatedAt 자동 생성
);

export default mongoose.model("Post", postSchema);
