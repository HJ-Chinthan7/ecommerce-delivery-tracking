import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL ||"http://localhost:5002";// ;

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

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Socket Emit Failed No active connection for event "${event}"`);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

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
