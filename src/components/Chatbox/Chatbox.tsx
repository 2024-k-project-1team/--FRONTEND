import React from "react";
import "./Chatbox.css";
import ChatItem from "../ChatItem/ChatItem";

interface ChatMessage {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

interface ChatboxProps {
  messages: ChatMessage[];
  showWelcomeMessage?: boolean;
}

const Chatbox: React.FC<ChatboxProps> = ({ messages, showWelcomeMessage = false }) => {
  return (
    <div className="chatbox">
      {showWelcomeMessage && (
        <div className="chat-area">
          <div className="welcome">안녕하세요</div>
          <div className="help">질문을 시작해보세요</div>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatItem 
          key={index} 
          message={msg.message} 
          isUser={msg.isUser} 
          isLoading={msg.isLoading}
        />
      ))}
    </div>
  );
};

export default Chatbox;
