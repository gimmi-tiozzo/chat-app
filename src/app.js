const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

//accetta connessione websocket dai client
io.on("connection", (socket) => {
    console.log("Nuova connessione tramite websocket");
    socket.emit("message", "Welcome!"); //solo me
    socket.broadcast.emit("message", "Un nuovo utente si è unito"); //tutti tranne me

    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();

        if (filter.isProfane(msg)) {
            callback("Rilevata oscenità nel testo!!!");
        }

        io.emit("message", msg); //tutti compreso me
        callback();
    });

    socket.on("sendLocation", ({ lat, long } = {}, callback) => {
        io.emit("message", `https://google.com/maps?q=${lat},${long}`);
        callback("Posizione condivisa!");
    });

    socket.on("disconnect", () => {
        io.emit("message", "Utente disconesso"); //tutti compreso me (in questo caso me non c'è perchè disconesso)
    });
});

module.exports = server;
