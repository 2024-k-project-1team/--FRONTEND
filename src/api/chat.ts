import axios from "axios";

const API_BASE_URL = "https://knbot.xyz/api/v1";

// 채팅방 생성
export const createChatRoom = async (accessToken: string): Promise<number> => {
  try {
    const response = await axios.post(
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
    return response.data; // 서버에서 받은 방 ID만 반환
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

// 모든 채팅방 조회 (페이지별로 불러와 합치는 함수)
export const getAllChatRooms = async (accessToken: string): Promise<any[]> => {
  let allRooms: any[] = [];
  let page = 0;
  let totalPages = 1;

  try {
    while (page < totalPages) {
      const response = await axios.get(
        `${API_BASE_URL}/chat/my-rooms?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "*/*",
          },
        }
      );

      const { content, totalPages: serverTotalPages } = response.data;
      allRooms = [...allRooms, ...content];
      totalPages = serverTotalPages;
      page++;
    }

    return allRooms;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

//특정 채팅방의 내용 조회
export const getChatRoomContents = async (
  accessToken: string,
  roomNumber: number,
  page: number = 0
): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/chat/contents/${roomNumber}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
        },
      }
    );

    console.log(`Chat contents for room ${roomNumber} fetched:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching chat contents for room ${roomNumber}:`,
      error
    );
    throw error;
  }
};
