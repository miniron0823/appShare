const fs = require("fs");
const privateKey = fs.readFileSync("openssl/private.pem");
const certificate = fs.readFileSync("openssl/public.pem");
const options = {
  key: privateKey,
  cert: certificate,
};

const express = require("express");
const app = express();
const server = require("https").createServer(options, app);
const port = 8080;
const socketIO = require("socket.io");
const controller = require("./router/controller");

app.use(express.static("static"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use("/", controller);

server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});

/****************************************************************************
 * webSocket
 ****************************************************************************/
io = socketIO.listen(server);
io.sockets.on("connection", function (socket) {
  // convenience function to log server messages on the client
  function log() {
    var array = ["Message from server:"];
    array.push.apply(array, arguments);
    socket.emit("log", array);
  }

  socket.on("message", function (message) {
    log("Client said: ", message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit("message", message);
  });

  socket.on("create or join", function (room) {
    log("Received request to create or join room " + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];

    var numClients = clientsInRoom
      ? Object.keys(clientsInRoom.sockets).length
      : 0;
    log("Room " + room + " now has " + numClients + " client(s)");

    if (numClients === 0) {
      socket.join(room);
      log("Client ID " + socket.id + " created room " + room);
      socket.emit("created", room, socket.id);
    } else if (numClients === 1) {
      log("Client ID " + socket.id + " joined room " + room);
      io.sockets.in(room).emit("join", room);
      socket.join(room);
      socket.emit("joined", room, socket.id);
      io.sockets.in(room).emit("ready");
    } else {
      // max two clients
      socket.emit("full", room);
    }
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("ipaddr", function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === "IPv4" && details.address !== "127.0.0.1") {
          socket.emit("ipaddr", details.address);
        }
      });
    }
  });

  socket.on("bye", function () {
    console.log("received bye");
  });
});
