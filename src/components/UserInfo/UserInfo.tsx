import React from "react";
import userIcon from "../../assets/icons/my_icon.png";
import "./UserInfo.css";

interface UserInfoProps {
  name: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name }) => {
  return (
    <div className="user-info">
      <img src={userIcon} alt="User Icon" className="user-icon" />
      <span className="user-name">{name}</span>
    </div>
  );
};

export default UserInfo;
