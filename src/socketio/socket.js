import { Server } from "socket.io";
import { auth, roles } from "../middleware/auth.js";
import { messageModel } from "../../db/model/message.model.js";

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
    socket.on("sendmessage", async (data) => {
      const { userId: receiverId, message } = data;
      const newMessage = await messageModel.create({
        message,
        senderId: socket.user.id,
        receiverId,
      });
      if (users[receiverId]) {
        io.to(users[receiverId].socketId).emit("messageTouser", {
          message: newMessage.message,
          senderName: socket.user.username,
          createdAt: newMessage.createdAt,
        });
      }
    });

    socket.on("disconnect", () => {
      delete users[userId];
    });
  });
};
