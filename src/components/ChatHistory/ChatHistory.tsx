import React, { useState, useEffect, useRef } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (roomId: number) => {
    setEditingRoomId(roomId);
    setNewTitle(roomTitles[roomId] || "");
    setActiveRoomId(null); // 수정 버튼을 눌렀을 때 드롭다운 메뉴가 닫히도록 설정
  };

  const handleRenameSubmit = (event: React.FormEvent, roomId: number) => {
    event.preventDefault();
    if (newTitle.trim()) {
      onRenameChat(roomId, newTitle.trim().replace(/^"|"$/g, "")); // 따옴표 제거하여 저장
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setActiveRoomId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 함수: 따옴표를 제거한 타이틀 반환
  const removeQuotes = (title: string) => title.replace(/^"|"$/g, "");

  return (
    <ul className="chat-history">
      {roomIds
        .slice()
        .reverse() // 기존 채팅방 목록은 시간순서대로 최신이 위로 오도록 정렬
        .map((roomId) => (
          <li
            key={roomId}
            className={currentRoomId === roomId ? "active" : ""}
            onClick={() => onSelectChat(roomId)}
          >
            <div className="chat-header">
              {editingRoomId === roomId ? (
                <form
                  className="edit"
                  onSubmit={(e) => handleRenameSubmit(e, roomId)}
                >
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
                  <h3 className="chat-title">
                    {removeQuotes(roomTitles[roomId] || "새 채팅방")}
                  </h3>
                  <button
                    className="kebab-menu"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      handleKebabClick(roomId);
                    }}
                  >
                    &#8226;&#8226;&#8226; {/* 케밥 아이콘 */}
                  </button>
                </div>
              )}
              {activeRoomId === roomId && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      handleEditClick(roomId);
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      onDeleteChat(roomId);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ChatHistory;
