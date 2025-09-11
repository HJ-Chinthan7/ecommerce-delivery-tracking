
const buses = require('../memoryStorage');
const allBusesSockets = (io) => {

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('joinAllBuses', () => {
            socket.join('all_buses');
            console.log(`Socket ${socket.id} joined all_buses room`);
        });

        socket.on('leaveAllBuses', () => {
            socket.leave('all_buses');
            console.log(`Socket ${socket.id} left all_buses room`);
        });

        socket.on("updateBusLocation", ({ busId, lat, lon }) => {
            buses[busId] = { lat, lon, timestamp: Date.now() };

            io.to(`bus_${busId}`).emit("bus:location", buses[busId]);

            io.to("all_buses").emit("buses:all", buses);
        });

    });
};
module.exports = allBusesSockets;


