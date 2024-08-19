import React, { useEffect, useState } from "react";
import "./ChatItem.css";

interface ChatItemProps {
  isUser?: boolean;
  message: string;
  isLoading?: boolean;  // 로딩 상태 추가
}

const ChatItem: React.FC<ChatItemProps> = ({ isUser, message, isLoading }) => {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      // 로딩이 완료되면 로딩 애니메이션을 제거
      setShowLoader(false);
    }
  }, [isLoading]);

  return (
    <div
      className={`chat-item ${isUser ? "user" : "response"}`}
      style={{
        backgroundColor: isLoading ? "transparent" : "#82C2FD",
      }}
    >
      {showLoader ? (
        <div className="loader-container">
          <div className="dots-loader"></div> {/* 로딩 애니메이션 */}
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
};

export default ChatItem;