/**
 * Crea un messaggio per una chat
 * @param {string} text messaggio
 * @returns Oggetto messaggio chat
 */
const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime(),
    };
};

/**
 * Crea un messaggio per una chat (link)
 * @param {string} url messaggio (link)
 * @returns Oggetto messaggio chat (link)
 */
const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime(),
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage,
};
