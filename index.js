import dotenv from "dotenv";
dotenv.config()
import express from "express";
import { bootstarp } from "./src/index.router.js";
import { initSocket } from "./src/socketio/socket.js";
const app = express();
const port = process.env.PORT || 3000;
bootstarp(app, express);
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});
const server = app.listen(port, () => {
  console.log(`app is run in port ${port}`);
});
initSocket(server);
