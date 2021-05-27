const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("Nuova connessione tramite websocket");
    socket.emit("message", "Welcome!"); //solo me
    socket.broadcast.emit("message", "Un nuovo utente si è unito"); //tutti tranne me

    socket.on("sendMessage", (msg) => {
        io.emit("message", msg); //tutti compreso me
    });

    socket.on("sendLocation", ({ lat, long } = {}) => {
        io.emit("message", `Location: latitude=${lat}, longitude=${long}`);
    });

    socket.on("disconnect", () => {
        io.emit("message", "Utente disconesso"); //tutti compreso me (in questo caso me non c'è perchè disconesso)
    });
});

module.exports = server;
