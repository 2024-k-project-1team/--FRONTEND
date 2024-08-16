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
        console.error("Access token is missing");
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
          setRoomId(chatRooms.rooms[0].id); // 첫 번째 방을 로드
        } else {
          console.log(
            "No stored roomId, waiting for user to create a new chat room."
          );
        }

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
              console.error("Failed to parse message:", error);
            }
          },
          () => {
            console.log("WebSocket connected successfully");
          }
        );
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
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
      setRoomTitles((prevTitles) => ({
        ...prevTitles,
        [newRoomId]: `Room ${newRoomId}`,
      })); // 기본 제목 설정
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
          setCurrentChat(roomIds.length > 0 ? chats[0] : []); // 남아있는 방의 채팅 기록을 로드
        }

        sessionStorage.removeItem("roomId");
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
        onSelectChat={handleSelectChat} // onSelectChat 핸들러 추가
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
