import React from "react";
import { useNavigate} from "react-router-dom"; 
import "./../styles/OnlyReporters.css";

function onlyReporters({isLoggedIn, userRole, onLogout}) {
  const navigate = useNavigate();

  return (
    <div className="reporters-container">
      <div className="reporters-buttons">
        {!isLoggedIn ? (
          //로그인 안 된 경우
          <>
            <button className="register-btn" onClick={() => navigate("/register")}>회원가입</button>
            <button className="login-btn" onClick={() => navigate("/login")}>로그인</button>
          </>
        ) : (
          //로그인 된 경우
          <>
            <button className="login-btn" onClick={onLogout}>로그아웃</button>
            {userRole === "User" && (<button className="requestRole-btn">편집장님 카카오톡으로 포스팅 권한 요청하세요!</button>)}
            {userRole === "Reporter" && (<button className="posting-btn" onClick={() => {navigate("/post")}}>기사 포스팅</button>)}
            {userRole === "Master" && (<button className="posting-btn" onClick={() => {navigate("/role")}}>포스팅 권한 부여하기</button>)}
          </>
        )}
      </div>
    </div>
  );
}

export default onlyReporters;