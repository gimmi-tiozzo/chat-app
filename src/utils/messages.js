/**
 * Crea un messaggio per una chat
 * @param {string} username username utente che invia il messaggio
 * @param {string} text messaggio
 * @returns Oggetto messaggio chat
 */
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    };
};

/**
 * Crea un messaggio per una chat (link)
 * @param {string} username username utente che invia il messaggio
 * @param {string} url messaggio (link)
 * @returns Oggetto messaggio chat (link)
 */
const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime(),
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage,
};
