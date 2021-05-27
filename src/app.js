const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

//accetta connessione websocket dai client
io.on("connection", (socket) => {
    console.log("Nuova connessione tramite websocket");

    //evento collegamento utente
    socket.on("join", ({ username, room }) => {
        socket.join(room);
        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit

        socket.emit("message", generateMessage("Welcome!")); //solo me
        socket.broadcast.to(room).emit("message", generateMessage(`${username} si è unito!`)); //tutti tranne me
    });

    //evento ricezione messaggio
    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();

        //verifica se il messaggio contiene testo non appropriato
        if (filter.isProfane(msg)) {
            callback("Rilevata oscenità nel testo!!!");
        }

        io.emit("message", generateMessage(msg)); //tutti compreso me
        callback();
    });

    //ricezione messaggio di geo-localizzazione
    socket.on("sendLocation", ({ lat, long } = {}, callback) => {
        //invia a tutti la posizine + ack al chiamante
        io.emit("locationMessage", generateLocationMessage(`https://google.com/maps?q=${lat},${long}`));
        callback("Posizione condivisa!");
    });

    //evento disconessione client
    socket.on("disconnect", () => {
        io.emit("message", generateMessage("Utente disconesso")); //tutti compreso me (in questo caso me non c'è perchè disconesso)
    });
});

module.exports = server;
