import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import WebSocketService from "../../websocket/websocketService";
import {
  createChatRoom,
  deleteChatRoom,
  renameChatRoom,
  getAllChatRooms,
  getChatRoomContents,
} from "../../api/chat";
import { formatMessage } from "../../utils/formatMsg";
import "./Chatting.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

const Chatting: React.FC = () => {
  const [chats, setChats] = useState<ChatMessage[][]>([]);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const [roomIds, setRoomIds] = useState<number[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomTitles, setRoomTitles] = useState<{ [key: number]: string }>({});
  const name = sessionStorage.getItem("name") || "User";

  useEffect(() => {
    const initializeChat = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token이 없습니다.");
        return;
      }

      try {
        // 채팅방 목록 불러오기
        const chatRooms = await getAllChatRooms(accessToken);

        if (chatRooms && chatRooms.length > 0) {
          // 채팅방 목록을 최근 생성된 순서로 정렬하여 RoomIds를 설정
          chatRooms.sort((a: any, b: any) => a.id - b.id);
          setRoomIds(chatRooms.map((room: any) => room.id));
          setRoomTitles(
            chatRooms.reduce((titles: { [key: number]: string }, room: any) => {
              titles[room.id] = room.roomName || `Room ${room.id}`;
              return titles;
            }, {})
          );

          setRoomId(chatRooms[0].id); // 첫 번째 방을 기본 선택
          await loadChatRoomContents(chatRooms[0].id); // 첫 번째 방의 채팅 기록 불러오기
        } else {
          console.log("저장된 방이 없습니다. 새 채팅방을 생성하세요.");
        }
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패:", error);
      }
    };

    initializeChat();
  }, []);

  // 특정 채팅방의 기록을 불러오는 함수
  const loadChatRoomContents = async (selectedRoomId: number) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token이 없습니다.");
        return;
      }

      const chatContents = await getChatRoomContents(
        accessToken,
        selectedRoomId,
        0
      );

      const formattedChats: ChatMessage[] = chatContents.content.flatMap(
        (chat: any) => [
          { message: chat.message, isUser: true },
          { message: chat.aiResponse, isUser: false },
        ]
      );

      const reversedChats = [];
      for (let i = formattedChats.length - 1; i >= 0; i -= 2) {
        reversedChats.push(formattedChats[i - 1]); // message
        reversedChats.push(formattedChats[i]); // aiResponse
      }

      setCurrentChat(reversedChats);
    } catch (error) {
      console.error("채팅방 기록 불러오기 실패:", error);
    }
  };

  // 채팅방을 선택하는 함수
  const handleSelectChat = async (selectedRoomId: number) => {
    if (roomId === selectedRoomId) return; // 현재 방과 동일하다면 아무 것도 하지 않음

    setRoomId(selectedRoomId);
    await loadChatRoomContents(selectedRoomId); // 선택한 방의 채팅 기록 불러오기

    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      WebSocketService.disconnect();
      WebSocketService.connect(
        accessToken,
        selectedRoomId.toString(),
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
    }
  };

  // 새 채팅방을 생성하는 함수
  const handleNewChat = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      // 현재 채팅방의 채팅 기록을 저장
      if (currentChat.length > 0 && roomId !== null) {
        setChats((prevChats) => {
          const newChats = [...prevChats];
          const currentRoomIndex = roomIds.indexOf(roomId);
          if (currentRoomIndex !== -1) {
            newChats[currentRoomIndex] = currentChat;
          }
          return newChats;
        });
        setCurrentChat([]); // 현재 채팅 내용 초기화
      }

      // 새 채팅방 생성
      const newRoomId = await createChatRoom(accessToken);
      console.log("새로 생성된 방 ID:", newRoomId);

      if (newRoomId === undefined || newRoomId === null) {
        console.error("채팅방 생성 실패: 새 채팅방 ID가 없습니다.");
        return;
      }

      // 새 채팅방을 맨 앞에 추가
      setRoomIds((prevRoomIds) => [newRoomId, ...prevRoomIds]);
      setChats((prevChats) => [[], ...prevChats]); // 새로운 채팅방에 빈 채팅 배열 추가
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [newRoomId]: "새 채팅방", // 기본 이름 설정
      }));

      // 새로 생성된 채팅방으로 이동
      await handleSelectChat(newRoomId);
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
        await deleteChatRoom(accessToken, roomIdToDelete);
        setRoomIds((prevRoomIds) =>
          prevRoomIds.filter((id) => id !== roomIdToDelete)
        );
        setChats((prevChats) =>
          prevChats.filter((_, index) => roomIds[index] !== roomIdToDelete)
        );
        setRoomTitles((prevTitles) =>
          Object.keys(prevTitles).reduce(
            (result, key) => {
              const id = parseInt(key);
              if (id !== roomIdToDelete) {
                result[id] = prevTitles[id];
              }
              return result;
            },
            {} as { [key: number]: string }
          )
        );

        if (roomIdToDelete === roomId) {
          setRoomId(roomIds.length > 0 ? roomIds[0] : null); // 남아있는 방 중 하나를 선택
          if (roomIds.length > 0) {
            await loadChatRoomContents(roomIds[0]); // 남아있는 방의 채팅 기록을 로드
          }
        }
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

  // 메시지 전송 함수
  const handleSendMessage = (message: string) => {
    if (!roomId) {
      console.error(
        "Room ID가 정의되지 않았습니다. 메시지를 보낼 수 없습니다."
      );
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
        onSelectChat={handleSelectChat}
        roomTitles={roomTitles}
      />
      <main className="chat-container">
        <UserInfo name={name} />
        <Chatbox
          messages={currentChat}
          showWelcomeMessage={showWelcomeMessage}
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chatting;
