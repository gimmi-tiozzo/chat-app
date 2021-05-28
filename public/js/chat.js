const socket = io();

//html elementi
const $messageForm = document.querySelector("#message-form");
const $sendMessageButton = document.querySelector("#send-message");
const $messageText = document.querySelector("#message-text");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

//template
const $messageTemplate = document.querySelector("#message-template");
const $locationTemplate = document.querySelector("#location-template");
const $sidebarTemplate = document.querySelector("#sidebar-template");

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

//invia al server i dati di collegamento dell'utente in chat
socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});

//ricezione lista utenti in room
socket.on("roomData", ({ room, users } = {}) => {
    const html = Mustache.render($sidebarTemplate.innerHTML, {
        room,
        users,
    });

    $sidebar.innerHTML = html;
});

//ricezione messaggi dal server
socket.on("message", (message) => {
    const html = Mustache.render($messageTemplate.innerHTML, {
        username: message.username,
        message: message.text,
        time: moment(message.createdAt).format("HH:mm"),
    });

    $messages.insertAdjacentHTML("beforeend", html);
});

//ricezione messaggi relativi alla geo-localizzazione
socket.on("locationMessage", (message) => {
    const html = Mustache.render($locationTemplate.innerHTML, {
        username: message.username,
        url: message.url,
        time: moment(message.createdAt).format("HH:mm"),
    });

    $messages.insertAdjacentHTML("beforeend", html);
});

//invia un messaggio a tutti gli attori collegati alla chat
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $sendMessageButton.setAttribute("disabled", "disabled");

    //invia il messaggio e logga eventuali errori dovuti a un linguaggi non permesso
    socket.emit("sendMessage", $messageText.value, (error) => {
        $sendMessageButton.removeAttribute("disabled");
        $messageText.value = "";
        $messageText.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Messaggio consegnato al server!");
    });
});

//invia al server le correnti coordinate per essere condivise con tutti gli attori in chat
$sendLocationButton.addEventListener("click", (e) => {
    //verifica se la geo localizzazione è supportata dal corrente browser
    if (!navigator.geolocation) {
        return alert("Geolocation non è supportato al tuo browser");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    //determina la corrente posizine
    navigator.geolocation.getCurrentPosition(
        (position) => {
            //recupera latitudine e longitudine
            const coords = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            };

            //invia al server le coordinate recuperate e logga un eventuale ack di ritorno
            socket.emit("sendLocation", coords, (data) => {
                $sendLocationButton.removeAttribute("disabled");
                console.log("Messaggio consegnato al server: " + data);
            });
        },
        (error) => {
            console.log(error);
        }
    );
});
