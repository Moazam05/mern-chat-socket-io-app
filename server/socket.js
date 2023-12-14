const socketIO = require("socket.io");
const colors = require("colors");

const initSocket = (server) => {
  const io = socketIO(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket.io".bold.bgRed);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room", room.bgRed);
    });

    // socket.on("chat", (data) => {
    //   socket.broadcast.emit("chat", data);
    // });

    // socket.on("typing", (data) => {
    //   socket.broadcast.emit("typing", data);
    // });
  });

  return io;
};

module.exports = initSocket;
