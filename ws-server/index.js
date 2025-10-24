import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

let connectedUsers = new Map();

io.on('connection', (socket) => {
    socket.on("join", (username) => {
        connectedUsers.set(socket.id, username);
        io.emit("userList", Array.from(connectedUsers.values()));
    });

    socket.on('message', (data) => {
        const message = {
            id: Date.now(),
            user: connectedUsers.get(socket.id) || "Anonyme",
            text: data.message,
            importance: data.importance || "normal",
            color: data.color || "black",
            timestamp: new Date().toISOString(),
        };
        io.emit("message", message);
    });

    socket.on("typing", (isTyping) => {
        const user = connectedUsers.get(socket.id);
        socket.broadcast.emit("typing", { user, isTyping });
    });

    socket.on("delivered", (msgId) => {
        socket.broadcast.emit("delivered", { msgId, by: connectedUsers.get(socket.id) });
    });

    socket.on("disconnect", () => {
        connectedUsers.delete(socket.id);
        io.emit("userList", Array.from(connectedUsers.values()));
    });
});

server.listen(8080, () => {
    console.log('Serveur démarré sur le port 8080');
});