const jwt = require("jsonwebtoken");
const store = require("./store");

module.exports = () => {
    store.onlineUsers = new Map();
    
    store.io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error: token required"));
        }
        try {
            const payload = jwt.verify(token, store.config.secret);
            socket.user = payload;
            next();
        } catch (err) {
            next(new Error("Authentication error: invalid token"));
        }
    });

    store.io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.email}`);
        socket.join(socket.user.id);
        
        socket.on("typing", ({ room, userId, isTyping }) => {
            socket.to(room).emit("userTyping", { room, userId, isTyping });
        });

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.email}`);
        });
    });
}