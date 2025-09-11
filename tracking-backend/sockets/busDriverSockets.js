const busDriverSockets = (io) => {

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
 
  socket.on('busDriverLogin', (data) => {
    const { busId } = data;
    socket.busId = busId;
    socket.join(`bus_${busId}`);
     socket.join('all_buses');
    console.log(`Bus driver logged in: ${busId}`);
  });

socket.on('busDriverLogout', () => {
  if (socket.busId) {
    socket.leave(`bus_${socket.busId}`);
    socket.leave('all_buses'); 
    console.log(`Bus driver logged out: ${socket.busId}`);
    delete socket.busId;
  }
});
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

};

module.exports = busDriverSockets;