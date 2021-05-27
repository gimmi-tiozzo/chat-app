const socket = io();
const form = document.querySelector("#message-form");
const txt = document.querySelector("#msg");
const btnLocation = document.querySelector("#send-location");

socket.on("message", (msg) => {
    console.log(msg);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("sendMessage", txt.value);
});

btnLocation.addEventListener("click", (e) => {
    if (!navigator.geolocation) {
        return alert("Geolocation non è supportato al tuo browser");
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const coords = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            };

            socket.emit("sendLocation", coords);
        },
        (error) => {
            console.log(error);
        }
    );
});
