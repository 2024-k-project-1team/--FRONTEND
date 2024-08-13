import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        await axios.delete("https://knbot.xyz/api/v1/auth/log-out", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("name");
        navigate("/");
      } else {
        console.error("로그아웃 실패: 토큰이 없습니다.");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return { handleLogout };
};
