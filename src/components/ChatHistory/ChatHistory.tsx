import React from 'react';
import './ChatHistory.css';

interface ChatMessage {
  message: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  chats: ChatMessage[][];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chats }) => {
  return (
    <div className="chat-history">
      {chats.map((chat, index) => (
        <div key={index} className="chat-record">
          <div className="chat-record-header">채팅 {index + 1}</div>
          {chat.map((message, msgIndex) => (
            <div key={msgIndex} className={`chat-message ${message.isUser ? 'user' : 'response'}`}>
              {message.message}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;
