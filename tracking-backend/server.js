
const app=require('./app')
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const PORT=process.env.PORT;
const busDriverSockets = require('./sockets/busDriverSockets');

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

busDriverSockets(io);
server.listen(PORT, () => {
  console.log(`Tracking backend server running on port ${PORT}`);
});

module.exports = { io };
