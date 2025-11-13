import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL||'http://localhost:5002'; // 
class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
    }
    return this.socket;
  }
 busDriverLogin(busId) {
    if (this.socket) {
      this.socket.emit('busDriverLogin', { busId });
    }
  }

  busDriverLogout(busId) {
    if (this.socket) {
      this.socket.emit('busDriverLogout', { busId });
    }
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn("Tried to emit without socket:", event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

   joinAllBuses() {
    if (this.socket) {
      this.socket.emit('joinAllBuses');
    }
  }
   updateBusLocation(data) {
    this.socket?.emit("updateBusLocation", data);
  }

  leaveAllBuses() {
    if (this.socket) {
      this.socket.emit('leaveAllBuses');
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }


};

export default new SocketService();
