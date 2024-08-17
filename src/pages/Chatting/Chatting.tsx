import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import WebSocketService from "../../websocket/websocketService";
import { createChatRoom, deleteChatRoom, renameChatRoom, getChatRooms } from "../../api/chat";
import { formatMessage } from "../../utils/formatMsg";
import "./Chatting.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

const Chatting: React.FC = () => {
  const [chats, setChats] = useState<ChatMessage[][]>(
    JSON.parse(sessionStorage.getItem("chats") || "[]")
  );
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const [roomIds, setRoomIds] = useState<number[]>(
    JSON.parse(sessionStorage.getItem("roomIds") || "[]")
  );
  const [roomId, setRoomId] = useState<number | null>(
    JSON.parse(sessionStorage.getItem("roomId") || "null")
  );
  const [roomTitles, setRoomTitles] = useState<{ [key: number]: string }>(
    JSON.parse(sessionStorage.getItem("roomTitles") || "{}")
  );
  const name = sessionStorage.getItem("name") || "User";

  useEffect(() => {
    sessionStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    sessionStorage.setItem("roomIds", JSON.stringify(roomIds));
  }, [roomIds]);

  useEffect(() => {
    sessionStorage.setItem("roomId", JSON.stringify(roomId));
  }, [roomId]);

  
  useEffect(() => {
    sessionStorage.setItem("roomTitles", JSON.stringify(roomTitles));
  }, [roomTitles]);


  useEffect(() => {
    const initializeChat = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const storedRoomId = sessionStorage.getItem("roomId");

      if (!accessToken) {
        console.error("Access token이 없습니다.");
        return;
      }

      try {
        // 채팅방 목록 가져오기
        const chatRooms = await getChatRooms(accessToken);
        
        if (chatRooms && chatRooms.rooms) {
          setRoomIds(chatRooms.rooms.map((room: any) => room.id));
          setRoomTitles(chatRooms.rooms.reduce((titles: { [key: number]: string }, room: any) => {
            titles[room.id] = room.title || `Room ${room.id}`;
            return titles;
          }, {}));
        }

        if (storedRoomId) {
          setRoomId(parseInt(storedRoomId, 10)); // 그 방을 로드
        } else if (chatRooms.rooms.length > 0) {
          setRoomId(chatRooms.rooms[0].id);// 첫 번째 방을 로드
        } else {
          console.log("저장된 방이 없습니다. 새 채팅방을 생성하세요.");
        }

        // WebSocket 연결 설정
        WebSocketService.connect(
          accessToken,
          storedRoomId || roomId?.toString() || "",
          (message) => {
            try {
              const parsedMessage = JSON.parse(message.body);
              const formattedAnswer = formatMessage(parsedMessage.answer);
              const botResponse: ChatMessage = {
                message: formattedAnswer,
                isUser: false,
              };
              setCurrentChat((prevChat) => [...prevChat, botResponse]);
            } catch (error) {
              console.error("메시지 파싱 실패:", error);
            }
          },
          () => {
            console.log("WebSocket 연결 성공");
          }
        );
      } catch (error) {
        console.error("채팅 초기화 실패:", error);
      }
    };

    initializeChat();

    return () => {
      WebSocketService.disconnect(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    };
  }, [roomId]);

  // 새 채팅방을 생성하는 함수
  const handleNewChat = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      if (currentChat.length > 0) {
        setChats((prevChats) => {
          const newChats = [...prevChats];
          newChats[roomIds.indexOf(roomId!)] = currentChat;
          return newChats;
        });
        setCurrentChat([]); // 현재 채팅 내용 초기화
      }

      const newRoomId = await createChatRoom(accessToken); // 새 채팅방 생성
      setRoomId(newRoomId);
      setRoomIds((prevRoomIds) => [...prevRoomIds, newRoomId]);
      setChats((prevChats) => [...prevChats, []]); // 새로운 채팅방에 빈 채팅 배열 추가
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [newRoomId]: `Room ${newRoomId}`, //기본 제목 설정
      }));
      sessionStorage.setItem("roomId", newRoomId.toString());
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

  // 채팅방 삭제 함수
  const handleDeleteChat = async (roomIdToDelete: number | null) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    if (roomIdToDelete) {
      try {
        await deleteChatRoom(accessToken, roomIdToDelete); // 채팅방 삭제 
        setRoomIds((prevRoomIds) =>
          prevRoomIds.filter((id) => id !== roomIdToDelete)
        );
        setChats((prevChats) =>
          prevChats.filter((_, index) => roomIds[index] !== roomIdToDelete)
        );
        setRoomTitles((prevTitles) =>
          Object.keys(prevTitles).reduce((result, key) => {
            const id = parseInt(key);
            if (id !== roomIdToDelete) {
              result[id] = prevTitles[id];
            }
            return result;
          }, {} as { [key: number]: string })
        );

        if (roomIdToDelete === roomId) {
          setRoomId(roomIds.length > 0 ? roomIds[0] : null); // 남아있는 방 중 하나를 선택
          setCurrentChat(roomIds.length > 0 ? chats[0] : []); // 남아있는 방의 채팅 기록을 로드
        }
        sessionStorage.removeItem("roomId");
      } catch (error) {
        console.error("채팅방 삭제 실패:", error);
      }
    }
  };

  // 채팅방 이름 변경 함수
  const handleRenameChat = async (roomIdToRename: number, newTitle: string) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      await renameChatRoom(accessToken, roomIdToRename, newTitle);
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [roomIdToRename]: newTitle,
      }));
    } catch (error) {
      console.error("채팅방 이름 변경 실패:", error);
    }
  };

  // 채팅방을 선택하는 함수
  const handleSelectChat = (selectedRoomId: number) => {
    if (roomId === selectedRoomId) return; // 현재 방과 동일하다면 아무 것도 하지 않음

    if (currentChat.length > 0) {
      setChats((prevChats) => {
        const newChats = [...prevChats];
        newChats[roomIds.indexOf(roomId!)] = currentChat;
        return newChats;
      });
      //setCurrentChat([]); // 새로운 방으로 이동 시 현재 채팅 내용을 초기화
    }

    setRoomId(selectedRoomId);
    const selectedChat = chats[roomIds.indexOf(selectedRoomId)] || [];
    setCurrentChat(selectedChat);
  };

  // 메시지 전송 함수
  const handleSendMessage = (message: string) => {
    if (!roomId) {
      console.error("Room ID가 정의되지 않았습니다. 메시지를 보낼 수 없습니다.");
      return;
    }
    const userMessage: ChatMessage = { message, isUser: true };

    setCurrentChat([...currentChat, userMessage]);

    if (WebSocketService.isConnected()) {
      WebSocketService.sendMessage(`/pub/knbot/${roomId}`, {
        type: "SEND",
        question: message,
      });
    } else {
      console.error("Client is not connected");
    }
  };

  // Welcome 메시지를 보여줄지 여부를 결정하는 곳 
  const showWelcomeMessage = currentChat.length === 0;

  return (
    <div className="chatting-container">
      <Sidebar
        chats={chats}
        roomIds={roomIds}
        currentRoomId={roomId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onSelectChat={handleSelectChat} // onSelectChat 핸들러 추가
        roomTitles={roomTitles}
      />
      <main className="chat-container">
        <UserInfo name={name} />
        {/* Chatbox 컴포넌트 랜더리함,  showWelcomeMessage로 환영 메시지 추가 */}
        <Chatbox messages={currentChat} showWelcomeMessage={showWelcomeMessage} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chatting;
