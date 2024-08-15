import React from "react";
import "./ChatHistory.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  chats: ChatMessage[][];
  roomIds: number[]; // 모든 채팅방의 ID
  currentRoomId: number | null; // 현재 사용 중인 채팅 방 ID
  onDeleteChat: (roomId: number | null) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  roomIds,
  currentRoomId,
  onDeleteChat,
}) => {
  return (
    <div className="chat-history">
      {roomIds.map((roomId, index) => (
        <div key={roomId} className="chat-record">
          <div className="chat-record-header">
            채팅방 {roomId}
            {roomId === currentRoomId && " (현재 사용 중)"}{" "}
            {/* 이거 나중에 수정해얗함!  */}
            <button
              className="delete-button"
              onClick={() => onDeleteChat(roomId)}
            >
              삭제
            </button>
          </div>
          {chats[index].map((message, msgIndex) => (
            <div
              key={msgIndex}
              className={`chat-message ${message.isUser ? "user" : "response"}`}
            >
              {message.message}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
