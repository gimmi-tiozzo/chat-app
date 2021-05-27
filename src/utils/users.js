const users = [];

/**
 * Aggiungi uno user alla chat
 * @param {string} id, username, room
 * @returns user aggiunto alla chat
 */
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: "Username e Room sono obbligatori",
        };
    }

    const existingUser = user.find((user) => user.room === room && user.username === username);

    if (existingUser) {
        return {
            error: `Username ${username} già presente in chat room ${room}`,
        };
    }

    const user = { id, username, room };
    users.push(user);

    return { user };
};

/**
 * Rimuovi uno user
 * @param {numnber} id id utente
 * @returns user se eliminato o undefined
 */
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index >= 0) {
        return users.splice(index, 1)[0];
    }
};

/**
 * Ritorna uno user per id
 * @param {number} id id user
 * @returns user se trovato o undefined
 */
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

/**
 * Ritorna users in room
 * @param {string} room room
 * @returns users se trovati o []
 */
const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom,
};
