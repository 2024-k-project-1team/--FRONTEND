import React, { useState } from "react";
import "./LoginPage.css";
import googleLogo from "../../assets/img/google.png";
import chatLogo from "../../assets/img/chatLogo.png";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    const googleURL = `${process.env.REACT_APP_GOOGLE_URL}&state=google`;
    window.location.href = googleURL;
  };

  return (
    <div className="container">
      <div className="login-form">
        <img className="chatLogo" src={chatLogo} alt="Chat Logo" />
        <h1>안녕하세요. 반가워요</h1>

        <div className="socialBox">
          <div className="google" onClick={handleGoogleLogin}>
            <img className="googleLogo" src={googleLogo} alt="Google Logo" />
            <div className="googleText">구글로 로그인하기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
