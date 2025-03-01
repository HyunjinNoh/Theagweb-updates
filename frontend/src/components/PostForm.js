import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/PostForm.css";

//게시글 작성
function PostForm() {
  const navigate = useNavigate();
  const editorRef = useRef(null); // CKEditor 인스턴스 참조
  const [userRole, setUserRole] = useState("");
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

    const role = localStorage.getItem("role");
    if (!role || role !== "Reporter") {
      alert("소속 기자만 글을 게시할 수 있습니다.");
      navigate("/"); // 권한 없으면 홈으로 이동
    } else {
      setUserRole(role);
    }

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
        <p className="explanation">
          ※사진 업로드 규칙※<br></br>
          💚최소화질로 보도사진 압축: 
            <a href="https://www.iloveimg.com/ko/compress-image" target="_blank">  iloveimg(다른 곳도 가능)</a><br></br>
          💚사진명 - 숫자만! 예) 173호 3면(1) 보도사진1 ▶ "173_3(1)_1"<br></br>
          💚원하는 위치에 갤러리 아이콘 클릭해서 "업로드 메뉴"▶"파일 선택", 서버로 전송" 클릭▶이미지 너비 400입력▶확인 클릭<br></br>
          💚사진설명 - 글씨체: 기본, 글씨크기: 11 pt, 정렬: 왼쪽, 글씨스타일: 볼드<br></br><br></br>
          ※텍스트 규칙※<br></br>
          💚기사내용 - 글씨체: times new roman, 글씨크기: 14 pt, 정렬: 양쪽<br></br>
          💚기자명 - 한 줄 띄고, 글씨체: 기본, 글씨크기: 14 pt, 정렬: 오른쪽<br></br>
          💚그 외 각주, 이탤릭, 볼드 등 다듬기<br></br><br></br>
          ※주의사항※<br></br>
          ❤️제목은 content칸에 또 쓰지 않기!<br></br>
          ❤️붙여넣기 할 때 ctrl+ shift + v or "텍스트로 붙여넣기" 버튼<br></br>
          ❤️탭 대신 스페이스 4번 or "들여쓰기" 버튼<br></br>
          ❤️에디터 공간 우측하단 스크롤로 늘리기 가능!<br></br>
        </p>
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
