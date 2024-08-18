import React from "react";
import "./Sidebar.css";
import ChatHistory from "../ChatHistory/ChatHistory";
import LogoutButton from "../LogoutButton/LogoutButton";

interface ChatMessage {
  message: string;
  isUser: boolean;
}

interface SidebarProps {
  chats: ChatMessage[][];
  roomIds: number[]; // 모든 채팅 방 ID
  currentRoomId: number | null; // 현재 사용 중인 채팅 방 ID
  onNewChat: () => void;
  onDeleteChat: (roomId: number | null) => void; // 삭제 버튼 클릭 시 호출될 함수
  onRenameChat: (roomId: number, newTitle: string) => void; // 채팅방 이름 변경 함수
  onSelectChat: (roomId: number) => void; // 채팅방을 선택할 때 호출되는 함수
  roomTitles: { [key: number]: string }; // 각 채팅방의 제목
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  roomIds,
  currentRoomId,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onSelectChat,
  roomTitles,
}) => {
  const handleNewChatWithRefresh = async () => {
    await onNewChat(); // 새 채팅방 생성
  };

  return (
    <aside className="sidebar">
      <div className="newchat">
        <div className="news-chat-text">새 채팅</div>
        <button className="new-chat-button" onClick={handleNewChatWithRefresh}>
          +{" "}
        </button>
      </div>
      <h2>기록</h2>
      <ChatHistory
        chats={chats}
        roomIds={roomIds}
        currentRoomId={currentRoomId}
        onDeleteChat={onDeleteChat}
        onRenameChat={onRenameChat}
        onSelectChat={onSelectChat}
        roomTitles={roomTitles}
      />
      <LogoutButton />
    </aside>
  );
};

export default Sidebar;
