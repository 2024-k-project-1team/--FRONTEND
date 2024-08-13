// 더미 데이터 이용한 테스트 코드임 나중에 삭제 해야함 !

import React, { useState, useEffect } from "react";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import { formatMessage } from "../../utils/formatMsg";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

const ExChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 웹소켓 연결
  useEffect(() => {
    const socket = new WebSocket("ws://your-websocket-url");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const formattedMessage = formatMessage(data.answer);

      // 서버에서 받은 메시지 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: formattedMessage, isUser: false },
      ]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = (userMessage: string) => {
    // 유저 메시지 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userMessage, isUser: true },
    ]);

    // 서버로 메시지 전송
    // socket.send(JSON.stringify({ message: userMessage }));

    // 더미 데이터 사용 (서버로부터 받은 것처럼 처리)
    const dummyData = {
      answer:
        "소프트웨어 개발자가 되기 위한 로드맵은 대략적으로 다음과 같이 짜실 수 있습니다.\n\n1학년:\n- 1학기: 소프트웨어개론 수강\n- 2학기: C프로그래밍 수강\n\n2학년:\n- 1학기: 자바프로그래밍, 자료구조 수강\n- 2학기: 객체지향프로그래밍, 모바일프로그래밍 수강\n\n3학년:\n- 1학기: 알고리즘, 웹프로그래밍, 자기주도프로젝트Ⅰ 수강\n- 2학기: 운영체제, 자기주도프로젝트Ⅱ 수강\n\n4학년:\n- 1학기: IoT응용, SW캡스톤디자인Ⅰ 수강\n- 2학기: 소프트웨어공학, SW캡스톤디자인Ⅱ 수강\n\n더 자세한 내용은 아래 링크를 확인해주세요. https://sae.kangnam.ac.kr/\n",
    };
    const formattedMessage = formatMessage(dummyData.answer);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: formattedMessage, isUser: false },
    ]);
  };

  return (
    <div>
      <Chatbox messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ExChat;
