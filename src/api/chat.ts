import axios from "axios";

const API_BASE_URL = "https://knbot.xyz/api/v1";

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
    const response = await axios.delete(
      `${API_BASE_URL}/chat/out/${roomNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
        },
      }
    );

    if (response.status === 200) {
      console.log(`Room ${roomNumber} deleted successfully`);
    } else {
      console.log(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting room ${roomNumber}:`, error);
    throw error;
  }
};

// 채팅방 이름 수정
export const renameChatRoom = async (
  accessToken: string,
  roomNumber: number,
  newName: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/rename/${roomNumber}?roomNumber=${roomNumber}`,
      JSON.stringify(newName),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Room ${roomNumber} renamed to ${newName} successfully`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error renaming room ${roomNumber}:`, error);
    throw error;
  }
};

// 채팅방 조회
export const getMyChatRooms = async (
  accessToken: string,
  page: number = 0
): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_BASE_URL}/chat/my-rooms`, {
      params: { page },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });

    console.log("My chat rooms response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving chat rooms:", error);
    throw error;
  }
};
