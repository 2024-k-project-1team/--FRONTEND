import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import { formatMessage } from "../../utils/formatMsg";
import WebSocketService from "../../services/websocket";
import "./Chatting.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

const Chatting: React.FC = () => {
  const [chats, setChats] = useState<ChatMessage[][]>([[]]);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const name = "user name"; // 예시 이름
  const email = "123456@naver.com"; // 예시 이메일

  useEffect(() => {
    WebSocketService.connect("ws://your-websocket-url"); // 여기에 실제 웹소켓 URL

    WebSocketService.onMessage((data: string) => {
      const botResponse: ChatMessage = {
        message: formatMessage(data),
        isUser: false,
      };
      setCurrentChat((prevChat) => [...prevChat, botResponse]);
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const handleNewChat = () => {
    if (currentChat.length > 0) {
      setChats([...chats, currentChat]);
      setCurrentChat([]);
    }
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = { message, isUser: true };

    setCurrentChat([...currentChat, userMessage]);

    WebSocketService.sendMessage(message); // 서버로 메시지 전송
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
