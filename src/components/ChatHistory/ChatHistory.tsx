import React, { useState } from "react";
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
  onRenameChat: (roomId: number, newTitle: string) => void;
  roomTitles: { [key: number]: string }; // 각 채팅방의 제목
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  roomIds,
  currentRoomId,
  onDeleteChat,
  onRenameChat,
  roomTitles,
}) => {
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleEditClick = (roomId: number) => {
    setEditingRoom(roomId);
    setNewTitle(roomTitles[roomId] || "");
  };

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingRoom !== null) {
      onRenameChat(editingRoom, newTitle);
      setEditingRoom(null);
      setNewTitle("");
    }
  };

  return (
    <div className="chat-history">
      {roomIds.map((roomId) => (
        <div key={roomId} className="chat-record">
          <div className="chat-record-header">
            {editingRoom === roomId ? (
              <form onSubmit={handleRenameSubmit}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <button type="submit">확인</button>
                <button type="button" onClick={() => setEditingRoom(null)}>
                  취소
                </button>
              </form>
            ) : (
              <>
                {roomTitles[roomId] || `Room ${roomId}`}
                {roomId === currentRoomId && " (현재 사용 중)"}
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(roomId)}
                >
                  수정
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDeleteChat(roomId)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
          {chats[roomIds.indexOf(roomId)]?.map((message, msgIndex) => (
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
