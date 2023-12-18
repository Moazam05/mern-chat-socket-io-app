const socketIO = require("socket.io");
const colors = require("colors");

const initSocket = (server) => {
  const io = socketIO(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io".bold.bgRed);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room:", room.bgRed);
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessage) => {
      var chat = newMessage.chat;

      if (!chat.users) return console.log("Chat.users not defined".red);

      chat.users.forEach((user) => {
        if (user._id === newMessage.sender._id) return;
        socket.in(user._id).emit("message received", newMessage);
      });
    });

    socket.off("setup", () => {
      console.log("Disconnected from socket.io".bold.bgRed);
      socket.leave(userData._id);
    });
  });

  return io;
};

module.exports = initSocket;
