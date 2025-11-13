import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5002";//import.meta.env.VITE_APP_SOCKET_URL || ;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on("connect", () => {
      console.log("Socket Connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socke Connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log("Socket Disconnecting manually");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      console.log(`Socket Emit ${event}:`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`Socket Emit Failed No active connection for event "${event}"`);
    }
  }

  on(event, callback) {
    if (this.socket) {
      console.log(`Socket On Listening for "${event}"`);
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      console.log(`Socket Off Removing listener for "${event}"`);
      this.socket.off(event);
    }
  }

  // Custom helpers
  busDriverLogin(busId) {
    this.emit("busDriverLogin", { busId });
  }

  busDriverLogout(busId) {
    this.emit("busDriverLogout", { busId });
  }

  joinBusRoom(busId) {
    this.emit("joinBusRoom", { busId });
  }

  leaveBusRoom(busId) {
    this.emit("leaveBusRoom", { busId });
  }

  joinAllBuses() {
    this.emit("joinAllBuses");
  }

  leaveAllBuses() {
    this.emit("leaveAllBuses");
  }

  updateBusLocation(data) {
    this.emit("updateBusLocation", data);
  }
}

export default new SocketService();
