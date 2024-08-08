import React from 'react';
import './ChatItem.css';

interface ChatItemProps {
  isUser?: boolean;
  message: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ isUser, message }) => {
    return (
      <div className={`chat-item ${isUser ? 'user' : 'response'}`}>
        {message}
      </div>
    );
  }

export default ChatItem;
