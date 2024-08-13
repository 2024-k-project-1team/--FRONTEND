class WebSocketService {
  private socket: WebSocket | null = null;

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    this.socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  onMessage(callback: (message: string) => void) {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        callback(event.data);
      };
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new WebSocketService();
