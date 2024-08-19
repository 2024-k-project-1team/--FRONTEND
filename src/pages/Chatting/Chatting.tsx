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
  isLoading?: boolean;
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
        const chatRooms = await getAllChatRooms(accessToken);

        if (chatRooms && chatRooms.length > 0) {
          chatRooms.sort((a: any, b: any) => a.id - b.id);
          setRoomIds(chatRooms.map((room: any) => room.id));
          setRoomTitles(
            chatRooms.reduce((titles: { [key: number]: string }, room: any) => {
              titles[room.id] = room.roomName || `Room ${room.id}`;
              return titles;
            }, {})
          );

          setRoomId(chatRooms[0].id);
          await loadChatRoomContents(chatRooms[0].id);
        } else {
          console.log("저장된 방이 없습니다. 새 채팅방을 생성하세요.");
        }
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패:", error);
      }
    };

    initializeChat();
  }, []);

  const loadChatRoomContents = async (selectedRoomId: number) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token이 없습니다.");
        return;
      }

      const chatContents = await getChatRoomContents(accessToken, selectedRoomId, 0);

      const formattedChats: ChatMessage[] = chatContents.content.flatMap(
        (chat: any) => [
          { message: chat.message, isUser: true },
          { message: chat.aiResponse, isUser: false, isLoading: false },
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

  const handleSelectChat = async (selectedRoomId: number) => {
    if (roomId === selectedRoomId) return;

    setRoomId(selectedRoomId);
    await loadChatRoomContents(selectedRoomId);

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
              isLoading: false,
            };
            setCurrentChat((prevChat) => {
              // 로더를 제거하고, 새로운 메시지를 추가
              const updatedChat = [...prevChat];
              updatedChat.pop();  // 마지막 로더 메시지를 제거
              return [...updatedChat, botResponse];
            });
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

  const handleNewChat = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token이 없습니다.");
      return;
    }

    try {
      if (currentChat.length > 0 && roomId !== null) {
        setChats((prevChats) => {
          const newChats = [...prevChats];
          const currentRoomIndex = roomIds.indexOf(roomId);
          if (currentRoomIndex !== -1) {
            newChats[currentRoomIndex] = currentChat;
          }
          return newChats;
        });
        setCurrentChat([]);
      }

      const newRoomId = await createChatRoom(accessToken);
      console.log("새로 생성된 방 ID:", newRoomId);

      if (newRoomId === undefined || newRoomId === null) {
        console.error("채팅방 생성 실패: 새 채팅방 ID가 없습니다.");
        return;
      }

      setRoomIds((prevRoomIds) => [...prevRoomIds, newRoomId]);
      setChats((prevChats) => [...prevChats, []]);
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [newRoomId]: "새 채팅방",
      }));

      await handleSelectChat(newRoomId);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

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
          setRoomId(roomIds.length > 0 ? roomIds[0] : null);
          if (roomIds.length > 0) {
            await loadChatRoomContents(roomIds[0]);
          }
        }
      } catch (error) {
        console.error("채팅방 삭제 실패:", error);
      }
    }
  };

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

  const handleSendMessage = (message: string) => {
    if (!roomId) {
      console.error("Room ID가 정의되지 않았습니다. 메시지를 보낼 수 없습니다.");
      return;
    }
    const userMessage: ChatMessage = { message, isUser: true };
    const botLoadingMessage: ChatMessage = { message: '', isUser: false, isLoading: true };

    setCurrentChat([...currentChat, userMessage, botLoadingMessage]);

    if (WebSocketService.isConnected()) {
      WebSocketService.sendMessage(`/pub/knbot/${roomId}`, {
        type: "SEND",
        question: message,
      });
    } else {
      console.error("Client is not connected");
      setCurrentChat((prevChat) => {
        const updatedChat = [...prevChat];
        updatedChat.pop();  // 연결 실패 시 로더 메시지를 제거
        return updatedChat;
      });
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
