
const app=require('./app')
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const connectDb=require("./database/db")
const PORT=process.env.PORT;
const busDriverSockets = require('./sockets/busDriverSockets');
const allBusesSockets = require('./sockets/allBusesSockets');
const originList = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV !== "production" && "http://localhost:5174"
].filter(Boolean); 
const io = socketIo(server, {
  cors: {
    origin:"https://real-time-trackingofbuses.netlify.app",//originList.length > 0 ? originList : ["https://real-time-trackingofbuses.netlify.app","http://localhost:5174"], 
    methods: ["GET", "POST"]
  }
});
connectDb().then(() => {
    busDriverSockets(io);
allBusesSockets(io);
server.listen(PORT, () => {
  console.log(`Tracking backend server running on port ${PORT}`);
});
}
).catch((err)=>{
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

module.exports = { io };
