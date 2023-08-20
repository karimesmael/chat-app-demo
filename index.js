const express = require("express");
var socket = require("socket.io");
const app = express();

const server = app.listen(5000 || process.env.PORT);

app.use(express.static("views"));

const io = socket(server, {
  cors: {
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("new-msg", {
      message: message,
      username: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnect", users[socket.id]);
    delete users[socket.id];
  });
});
