import React, { useState } from "react";
import userIcon from "../../assets/icons/my_icon.png";
import "./UserInfo.css";

interface UserInfoProps {
  name: string;
  email: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, email }) => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div
      className="user-info"
      onMouseEnter={() => setShowEmail(true)}
      onMouseLeave={() => setShowEmail(false)}
    >
      <img src={userIcon} alt="User Icon" className="user-icon" />
      <span className="user-name">{name}</span>
      {showEmail && <div className="user-email">{email}</div>}
    </div>
  );
};

export default UserInfo;
