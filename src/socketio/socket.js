import { Server } from "socket.io";
import { auth, roles } from "../middleware/auth.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.use(auth(Object.values(roles)));
  let users = {};
  io.on("connection", (socket) => {
    let userId = socket.user.id;
    users[userId] = { socketId: socket.id };
    socket.emit("hellouser", "Welcome to the server!");
    socket.on("sendmessage", (data) => {
      const { userId: receiverId, message } = data;
      if (users[receiverId]) {
        io.to(users[receiverId].socketId).emit("messageTouser", {
          message: message,
          senderName: socket.user.username,
          createdAt: new Date(),
        });
      }
    });
    socket.on("disconnect", () => {
      delete users[userId];
    });
  });
};
