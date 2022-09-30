import express from "express";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

//port
const PORT = 3000;
server.listen(PORT, () => {
  console.log("listening on *:3000");
});

var user = [];
var messages = [];

//io
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Something connection");
  socket.on("send-username", (name) => {
    const existUsername = user.includes(name);
    if (!existUsername) {
      user.push(name);
      socket.Username = name;
      //emit notifition to user signup
      socket.emit("signup-success", name);
      //emit all notification to users onlining
      io.sockets.emit("user-online", user);
      console.log(99999);
      // socket.on("send-message", (message) => {
      //   console.log("message", message);
      //   messages.push({ name: socket.Username, message });
      //   console.log(333333333, messages);
      //   io.sockets.emit("get-messges", messages);
      // });
    } else {
      //edit infi signup failed
      socket.emit("signup-failed");
    }
  });

  //input message
  socket.on("send-message", (message) => {
    console.log("message", message);
    messages.push({ name: socket.Username, message });
    console.log(333333333, messages);
    io.sockets.emit("get-messges", messages);
  });
});

//router
app.get("/", function (req, res) {
  res.render("home");
});
