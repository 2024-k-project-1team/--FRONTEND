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
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

  useEffect(() => {
    WebSocketService.connect("ws://your-websocket-url"); // 여기에 실제 웹소켓 URL

    WebSocketService.onMessage((data: string) => {
      const botResponse: ChatMessage = {
        message: formatMessage(data),
        isUser: false,
      };
      setCurrentChat((prevChat) => [...prevChat, botResponse]);
      setIsWelcomeVisible(false); // 채팅이 시작되면 시작 메시지 숨김 
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const handleNewChat = () => {
    if (currentChat.length > 0) {
      setChats([...chats, currentChat]);
      setCurrentChat([]);   
      setIsWelcomeVisible(true); // 새 채팅을 시작하면 시작부분 메세지 보임
    }
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = { message, isUser: true };

    setCurrentChat([...currentChat, userMessage]);

    WebSocketService.sendMessage(message); // 서버로 메시지 전송
    setIsWelcomeVisible(false); //메세지 보내면 시작텍스트는 숨겨져야함
  };

  return (
    <div className="chatting-container">
      <Sidebar chats={chats} onNewChat={handleNewChat} />
      <main className="chat-container">
        <UserInfo name={name} email={email} />
        <Chatbox messages={currentChat} showWelcomeMessage={isWelcomeVisible} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chatting;
