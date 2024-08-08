import React from 'react';
import './Chatbox.css';
import ChatItem from './ChatItem';

interface ChatMessage {
  message: string;
  isUser: boolean;
}

interface ChatboxProps {
  messages: ChatMessage[];
}

const Chatbox: React.FC<ChatboxProps> = ({ messages }) => {
  return (
    <div className="chatbox">
      {messages.map((msg, index) => (
       <ChatItem key={index} message={msg.message} isUser={msg.isUser} />
      ))}
    </div>
  );
}

export default Chatbox;
