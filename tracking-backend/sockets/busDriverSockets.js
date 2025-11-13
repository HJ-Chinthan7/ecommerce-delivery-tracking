

const busDriverSockets = (io, socket) => {
  socket.on("busDriverLogin", (data) => {
    const { busId } = data;
    socket.busId = busId;
    socket.join(`bus_${busId}`);
  });

  socket.on("busDriverLogout", () => {
    if (socket.busId) {
      socket.leave(`bus_${socket.busId}`);
      delete socket.busId;
    }
  });

  socket.on("disconnect", () => {
    if (socket.busId) {
      socket.leave(`bus_${socket.busId}`);
      delete socket.busId;
    }
  });
};

module.exports = busDriverSockets;
