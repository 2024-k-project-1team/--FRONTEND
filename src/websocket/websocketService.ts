import { Client, IMessage } from "@stomp/stompjs";

class WebSocketService {
  private client: Client | null = null;

  connect(
    accessToken: string,
    roomId: string,
    onMessage: (message: IMessage) => void,
    onConnect?: () => void,
    onError?: (error: any) => void
  ) {
    this.client = new Client({
      brokerURL: "ws://knbot.xyz:8080/chat", // WebSocket 서버 URL
      connectHeaders: {
        Authorization: `${accessToken}`,
      },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log(
          `Connected to STOMP server and subscribed to room ${roomId}`
        );
        if (onConnect) onConnect();

        //채팅방 구독
        this.client?.subscribe(`/sub/chatroom/${roomId}`, onMessage);
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        if (onError) onError(frame);
      },
    });

    this.client.activate();
  }

  sendMessage(destination: string, body: any) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error("Client is not connected");
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log("Disconnected from STOMP server");
    }
  }

  isConnected() {
    return this.client !== null && this.client.connected;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
