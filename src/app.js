const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, getUser, getUserInRoom, removeUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

//accetta connessione websocket dai client
io.on("connection", (socket) => {
    console.log("Nuova connessione tramite websocket");

    //evento collegamento utente
    socket.on("join", ({ username, room } = {}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit

        socket.emit("message", generateMessage("Admin", "Welcome!")); //solo me
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} si è unito!`)); //tutti tranne me
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room),
        });

        callback();
    });

    //evento ricezione messaggio
    socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter();

        //verifica se il messaggio contiene testo non appropriato
        if (filter.isProfane(msg)) {
            callback("Rilevata oscenità nel testo!!!");
        }

        const user = getUser(socket.id);
        io.to(user.room).emit("message", generateMessage(user.username, msg)); //tutti compreso me
        callback();
    });

    //ricezione messaggio di geo-localizzazione
    socket.on("sendLocation", ({ lat, long } = {}, callback) => {
        const user = getUser(socket.id);
        //invia a tutti la posizine + ack al chiamante
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${lat},${long}`));
        callback("Posizione condivisa!");
    });

    //evento disconessione client
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", "Utente disconesso")); //tutti compreso me (in questo caso me non c'è perchè disconesso)
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUserInRoom(user.room),
            });
        }
    });
});

module.exports = server;
