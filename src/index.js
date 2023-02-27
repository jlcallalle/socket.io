const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use( express.static(path.join(__dirname, "views")) );

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", socket => {
    console.log('socket id', socket.id);
    console.log('Clientes conectados', io.engine.clientsCount);
    // console.log('socket handshake', socket.handshake);
    /* socket.on ("disconnect", () => {
        console.log("El socket " + socket.id + "se ha desconectado");
    }) */
});

httpServer.listen(3000);