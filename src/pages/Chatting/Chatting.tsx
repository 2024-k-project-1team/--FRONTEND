import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import "./Chatting.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

const Chatting: React.FC = () => {
  const [chats, setChats] = useState<ChatMessage[][]>([[]]);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const name = "Hyejung Yoon"; // 예시 이름
  const email = "123456@naver.com"; // 예시 이메일

  const handleNewChat = () => {
    if (currentChat.length > 0) {
      setChats([...chats, currentChat]);
      setCurrentChat([]);
    }
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = { message, isUser: true };
    const botResponse: ChatMessage = { message: message, isUser: false };

    setCurrentChat([...currentChat, userMessage, botResponse]);
  };

  return (
    <div className="chatting-container">
      <Sidebar chats={chats} onNewChat={handleNewChat} />
      <main className="chat-container">
        <UserInfo name={name} email={email} />
        <Chatbox messages={currentChat} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chatting;
