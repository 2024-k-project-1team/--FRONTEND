import React, { useState } from "react";
import "./ChatHistory.css";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  chats: ChatMessage[][];
  roomIds: number[];
  currentRoomId: number | null;
  onDeleteChat: (roomId: number | null) => void;
  onRenameChat: (roomId: number, newTitle: string) => void;
  onSelectChat: (roomId: number) => void;
  roomTitles: { [key: number]: string };
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  roomIds,
  currentRoomId,
  onDeleteChat,
  onRenameChat,
  onSelectChat,
  roomTitles,
}) => {
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);

  const handleEditClick = (roomId: number) => {
    setEditingRoomId(roomId);
    setNewTitle(roomTitles[roomId] || "");
  };

  const handleRenameSubmit = (event: React.FormEvent, roomId: number) => {
    event.preventDefault();
    if (newTitle.trim()) {
      onRenameChat(roomId, newTitle.trim());
      setEditingRoomId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setNewTitle("");
  };

  const handleKebabClick = (roomId: number) => {
    setActiveRoomId(activeRoomId === roomId ? null : roomId);
  };

  return (
    <ul className="chat-history">
      {roomIds.map((roomId) => (
        <li
          key={roomId}
          className={currentRoomId === roomId ? "active" : ""}
          onClick={() => onSelectChat(roomId)}
        >
          <div className="chat-header">
            {editingRoomId === roomId ? (
              <form className="edit" onSubmit={(e) => handleRenameSubmit(e, roomId)}>
                <input
                  className="edit-text"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  required
                />
                <button type="submit">확인</button>
                <button type="button" onClick={handleCancelEdit}>
                  취소
                </button>
              </form>
            ) : (
              <div className="chat-title-container">
                <h3 className="chat-title">{roomTitles[roomId] || `Room ${roomId}`}</h3>
                <button className="kebab-menu" onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 전파 방지
                  handleKebabClick(roomId);
                }}>
                  &#8226;&#8226;&#8226; {/* 케밥 아이콘 */}
                </button>
                {activeRoomId === roomId && (
                  <div className="dropdown-menu">
                    <button onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      handleEditClick(roomId);
                    }}>수정</button>
                    <button onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      onDeleteChat(roomId);
                    }}>삭제</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatHistory;
