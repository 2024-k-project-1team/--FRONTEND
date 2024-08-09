import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import googleLogo from "../../assets/img/google.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 처리 로직
    navigate("/chatting");
  };

  return (
    <div className="container">
      <div className="login-form">
        <h1>안녕하세요. 반가워요</h1>
        <form onSubmit={handleLogin}>
          <div>
            <div className="loginText">아이디</div>
            <input
              type="text"
              id="username"
              placeholder="이메일 또는 아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <div className="loginText">비밀번호</div>
            <input
              type="password"
              id="password"
              placeholder="비밀번호입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="loginMid">
            <label className="autoLogin" for="hint">
              {" "}
              <input type="checkbox" id="hint" /> 아이디 기억하기
            </label>
            <div className="autoLogin">비밀번호 찾기</div>
          </div>
          <button type="submit" className="loginBtn">
            로그인
          </button>
          <div className="socialBox">
            <div className="google">
              <img className="googleLogo" src={googleLogo} />
              <div className="googleText">또는 구글로 로그인하기</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
