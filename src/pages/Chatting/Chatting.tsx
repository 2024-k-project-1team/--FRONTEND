import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserInfo from "../../components/UserInfo/UserInfo";
import Chatbox from "../../components/Chatbox/Chatbox";
import ChatInput from "../../components/ChatInput/ChatInput";
import WebSocketService from "../../websocket/websocketService";
import { createChatRoom, deleteChatRoom, renameChatRoom } from "../../api/chat";
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
        console.error("Access token is missing");
        return;
      }

      if (!roomId) {
        try {
          const newRoomId = await createChatRoom(accessToken);
          setRoomId(newRoomId);
          setRoomIds((prevRoomIds) => [...prevRoomIds, newRoomId]);
          setChats((prevChats) => [...prevChats, []]); // 새로운 방에 대한 빈 채팅 배열 추가
          setRoomTitles((prevTitles) => ({ ...prevTitles, [newRoomId]: `Room ${newRoomId}` })); // 기본 제목 설정
          sessionStorage.setItem("roomId", newRoomId.toString());
        } catch (error) {
          console.error("Failed to create chat room:", error);
          return;
        }
      }

      WebSocketService.connect(
        accessToken,
        roomId!.toString(),
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
            console.error("Failed to parse message:", error);
          }
        },
        () => {
          console.log("WebSocket connected successfully");
        }
      );
    };

    initializeChat();

    return () => {
      WebSocketService.disconnect();
    };
  }, [roomId]);

  const handleNewChat = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      if (currentChat.length > 0) {
        setChats((prevChats) => {
          const newChats = [...prevChats];
          newChats[roomIds.indexOf(roomId!)] = currentChat;
          return newChats;
        });
        setCurrentChat([]);
      }

      const newRoomId = await createChatRoom(accessToken);
      setRoomId(newRoomId);
      setRoomIds((prevRoomIds) => [...prevRoomIds, newRoomId]);
      setChats((prevChats) => [...prevChats, []]); // 새로운 채팅방에 빈 채팅 배열 추가
      setRoomTitles((prevTitles) => ({ ...prevTitles, [newRoomId]: `Room ${newRoomId}` })); // 기본 제목 설정
      sessionStorage.setItem("roomId", newRoomId.toString());
    } catch (error) {
      console.error("Failed to create chat room:", error);
    }
  };

  const handleDeleteChat = async (roomIdToDelete: number | null) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token is missing");
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

        sessionStorage.removeItem("roomId"); // 세션에서 방 번호 제거
      } catch (error) {
        console.error("Failed to delete chat room:", error);
      }
    }
  };

  const handleRenameChat = async (roomIdToRename: number, newTitle: string) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      await renameChatRoom(accessToken, roomIdToRename, newTitle);
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [roomIdToRename]: newTitle,
      }));
    } catch (error) {
      console.error("Failed to rename chat room:", error);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!roomId) {
      console.error("Room ID is undefined, cannot send message.");
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

  return (
    <div className="chatting-container">
      <Sidebar
        chats={chats}
        roomIds={roomIds}
        currentRoomId={roomId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        roomTitles={roomTitles}
      />
      <main className="chat-container">
        <UserInfo name={name} />
        <Chatbox messages={currentChat} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chatting;
