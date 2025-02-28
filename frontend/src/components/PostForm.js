import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PostForm() {
  const { id } = useParams(); // 게시글 ID 
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const editorRef = useRef(null); // CKEditor 인스턴스 참조
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // 권한 확인
    const role = localStorage.getItem("role");
    if (!role || role !== "Reporter") {
      alert("You do not have access to this page.");
      navigate("/"); // 권한 없으면 홈으로 이동
    } else {
      setUserRole(role);
    }

    // CKEditor 초기화
    if (document.getElementById("editor")) {
      window.CKEDITOR.replace("editor", {
        height: 300,
        filebrowserUploadUrl: `http://localhost:7000/api/posts/${id}/postImage`,
        filebrowserUploadMethod: "form",
        extraPlugins: "uploadimage", // 이미지 업로드 플러그인 활성화
        filebrowserUploadMethod: "xhr", // iframe 대신 XHR을 사용
      });

      // CKEditor 업로드 후 URL 표시를 위한 이벤트 추가
      window.CKEDITOR.instances.editor.on("fileUploadResponse", function (evt) {
        const xhr = evt.data.fileLoader.xhr;
        const response = JSON.parse(xhr.responseText);

        if (response.uploaded) {
          console.log("Uploaded URL:", response.url); // URL 확인용 로그
          evt.data.fileLoader.fileName = response.url; // 업로드된 URL을 CKEditor에 자동 삽입
        } else {
          console.error("Upload failed:", response.error); // 실패 로그
        }
      });

      editorRef.current = window.CKEDITOR.instances.editor;
    }

    return () => {
      // CKEditor 인스턴스 해제
      if (editorRef.current) {
        editorRef.current.destroy(true);
      }
    };
  }, [id, navigate]);

  const handleSubmit = async () => {
    const content = editorRef.current?.getData(); // CKEditor 내용 가져오기
    if (!content) {
      alert("Content is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/api/posts", {
        method: "POST", // 새 글 작성 요청
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...form, content }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("게시글 작성이 완료되었습니다.");
        navigate("/"); // 작성 또는 수정 후 홈으로 이동
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };

  return (
    <div className="post-form-container">
      <h1>New Post</h1>
      <div>
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>On Campus</option>
          <option>Feature</option>
          <option>Issue</option>
          <option>Society</option>
          <option>Global</option>
          <option>Culture</option>
          <option>Entertainment</option>
          <option>Economics</option>
          <option>Business</option>
          <option>Technology</option>
        </select>
      </div>
      <div>
        <label>Content</label>
        <textarea id="editor" defaultValue={form.content} />
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Create Post
      </button>
    </div>
  );
}

export default PostForm;
