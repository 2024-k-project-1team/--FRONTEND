import React from 'react';
import './Sidebar.css';
import ChatHistory from './ChatHistory';
import LogoutButton from './LogoutButton';

interface ChatMessage {
  message: string;
  isUser: boolean;
}
interface SidebarProps {
  chats: ChatMessage[][];
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onNewChat }) => {
  return (
    <aside className="sidebar">
      <button className="new-chat-button" onClick={onNewChat}>새 채팅  + </button>
      <h2>기록</h2>
      <ChatHistory chats={chats} />
      <LogoutButton />
    </aside>
  );
}

export default Sidebar;
