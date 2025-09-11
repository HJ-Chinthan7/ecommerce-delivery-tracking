
const app=require('./app')
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const PORT=process.env.PORT;

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});



server.listen(PORT, () => {
  console.log(`Tracking backend server running on port ${PORT}`);
});

module.exports = { io };
