import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5002';

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


};

export default new SocketService();
