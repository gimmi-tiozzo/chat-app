const socket = io();

const $messageForm = document.querySelector("#message-form");
const $sendMessageButton = document.querySelector("#send-message");
const $messageText = document.querySelector("#message-text");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $messageTemplate = document.querySelector("#message-template");

//ricezione messaggi dal server
socket.on("message", (message) => {
    const html = Mustache.render($messageTemplate.innerHTML, {
        message,
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
