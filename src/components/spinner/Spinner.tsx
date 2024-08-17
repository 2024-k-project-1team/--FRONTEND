import React from "react";
import "./Spinner.css"; 

const Spinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div className="loading-text">
        <div>강냉봇</div>
        <div>로그인 중입니다. 잠시만 기다려 주세요.</div>
      </div>
    </div>
  );
};

export default Spinner;
