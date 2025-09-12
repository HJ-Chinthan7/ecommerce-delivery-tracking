
const app=require('./app')
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const PORT=process.env.PORT;
const busDriverSockets = require('./sockets/busDriverSockets');
const allBusesSockets = require('./sockets/allBusesSockets');
const originList = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV !== "production" && "http://localhost:5174"
].filter(Boolean); 
const io = socketIo(server, {
  cors: {
    origin:originList.length > 0 ? originList : ["http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

busDriverSockets(io);
allBusesSockets(io);
server.listen(PORT, () => {
  console.log(`Tracking backend server running on port ${PORT}`);
});

module.exports = { io };
