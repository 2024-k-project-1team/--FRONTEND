// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import googleLogo from '../../assets/img/google.png';
import chatLogo from '../../assets/img/chatLogo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 처리 로직
    navigate('/chatting'); 
  };

  return (
    <div className="container">
      <div className="login-form">
        <img className="chatLogo" src={chatLogo} />
        <h1>안녕하세요. 반가워요</h1>
 
          <div className="socialBox">
                    <div className="google">
                      <img
                        className="googleLogo"
                        src={googleLogo}
                      />
                      <div className="googleText">구글로 로그인하기</div>
                    </div>
                  </div>
      </div>
    </div>
  );
};

export default LoginPage;