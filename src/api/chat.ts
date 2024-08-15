import axios from "axios";

const API_BASE_URL = "https://knbot.xyz/api/v1"; // API 베이스 URL

// 채팅방 생성
export const createChatRoom = async (accessToken: string): Promise<number> => {
  try {
    const response = await axios.post<number>(
      `${API_BASE_URL}/chat/new`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
        },
      }
    );

    console.log("Room creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

// 채팅방 삭제
export const deleteChatRoom = async (
  accessToken: string,
  roomNumber: number
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/chat/out/${roomNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });
    console.log(`Room ${roomNumber} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting room ${roomNumber}:`, error);
    throw error;
  }
};
