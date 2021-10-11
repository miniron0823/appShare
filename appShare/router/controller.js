const app = require("express");

const controller = app.Router();
const path = require("path");

controller.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});
controller.get("/:roomName", (req, res, next) => {
  res.render("room", { roomID: req.params.roomName });
});

module.exports = controller;
