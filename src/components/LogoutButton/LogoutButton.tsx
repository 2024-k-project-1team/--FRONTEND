import React from "react";
import { useLogout } from "../../auth/Logout";

const LogoutButton: React.FC = () => {
  const { handleLogout } = useLogout();
  return (
    <button className="logout-button" onClick={handleLogout}>
      <span className="btn-text">로그아웃</span>
    </button>
  );
};

export default LogoutButton;
