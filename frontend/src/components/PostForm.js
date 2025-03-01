import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/PostForm.css";

//게시글 작성
function PostForm() {
  const navigate = useNavigate();
  const editorRef = useRef(null); // CKEditor 인스턴스 참조
  const [form, setForm] = useState({
    title: "", 
    category: "", 
    content: "", 
    issue: "", 
    page: "", 
    previewSentence: "", 
    thumbnailImage: "" ,
  });

  useEffect(() => {
    // CKEditor 초기화
    if (document.getElementById("editor")) {
      window.CKEDITOR.replace("editor", {
        height: 300,
        filebrowserUploadUrl: "http://localhost:7000/api/posts/postImages",
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
      if (editorRef.current) {
        editorRef.current.destroy(true); // 컴포넌트 언마운트 시 CKEditor 인스턴스 제거
      }
    };
  }, []);

  const handleSubmit = async () => {
    // Get the content from CKEditor
    const content = editorRef.current?.getData(); 
    
    if (!content) {
      alert("내용은 필수 입력 항목입니다.");
      return;
    }
  
    // Check if issue and page are not empty and convert them to numbers
    const issueNumber = parseInt(form.issue, 10);
    const pageNumber = parseInt(form.page, 10);
  
    // Validate if issue and page are valid numbers
    if (isNaN(issueNumber) || isNaN(pageNumber)) {
      alert("Issue와 Page 항목은 숫자여야 합니다.");
      return;
    }
  
    if (!form.category || !form.title) {
      alert("제목과 카테고리는 필수 입력 항목입니다.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:7000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          content,
          issue: issueNumber,  // Send issue as number
          page: pageNumber,    // Send page as number
          previewSentence: form.previewSentence,
          thumbnailImage: form.thumbnailImage,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("기사가 게시되었습니다.");
        navigate("/"); // Redirect after successful post creation
      } else {
        alert(data.message || "기사 등록 오류");
      }
    } catch (err) {
      console.error("기사 등록 오류:", err);
    }
  };
  

  return (
    <div className="post-form-container">
      <h1>Post Article</h1>
      <div>
        <label>Title</label>
        <input
          type="text"
          placeholder="기사 제목 (편집일 최종본)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <label>Issue</label>
        <input
          type="text"
          placeholder="몇 호인지 숫자만 입력 (예: 173)"
          value={form.issue}
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
        />
      </div>
      <div>
        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>(예: 1면, 보도기사는 On Campus 선택)</option>
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

        <label>Page </label>
        <select
          value={form.page}
          onChange={(e) => setForm({ ...form, page: e.target.value })}
        >
          <option>(예: 3면(1)이면 31 선택)</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
          <option>24</option>
          <option>25</option>
          <option>26</option>
          <option>31</option>
          <option>32</option>
          <option>33</option>
          <option>34</option>
          <option>35</option>
          <option>36</option>
          <option>41</option>
          <option>42</option>
          <option>43</option>
          <option>44</option>
          <option>51</option>
          <option>52</option>
          <option>53</option>
          <option>54</option>
          <option>61</option>
          <option>62</option>
          <option>63</option>
          <option>64</option>
          <option>71</option>
          <option>72</option>
          <option>73</option>
          <option>74</option>
          <option>81</option>
          <option>82</option>
          <option>83</option>
          <option>84</option>
        </select>
      </div>
      <div>
        <label>20 words for preview</label>
        <input
          type="text"
          placeholder="(예: Samsung Electronics’ stock price, which stood at 83,100 won on August 1, ...) "
          value={form.previewSentence}
          onChange={(e) => setForm({ ...form, previewSentence: e.target.value })}
        />
      </div>
      <div>
        <label>1 Thumbnail Image Link</label>
        <input
          type="text"
          placeholder="에디터로 사진 업로드 후 링크 복사 붙여넣기"
          value={form.thumbnailImage}
          onChange={(e) => setForm({ ...form, thumbnailImage: e.target.value })}
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          id="editor"
          value={form.content}  // value로 form.content를 설정
          onChange={(e) => setForm({ ...form, content: e.target.value })} // onChange로 상태 관리
        />
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
}

export default PostForm;
