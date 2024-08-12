import React from "react";
import { useLogout } from "../../auth/Logout";

const LogoutButton: React.FC = () => {
  const { handleLogout } = useLogout();
  return (
    <button className="logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
