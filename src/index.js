const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://invex.modyo.be/", "https://socket-io-jlcallalle.vercel.app/"],
      }
});
app.use( express.static(path.join(__dirname, "views")) );

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", socket => {

    // Información Servidor
    console.log('websocket Server');
    console.log('socket handshake', socket.handshake);
    console.log('socket id', socket.id);
    console.log('Clientes conectados', io.engine.clientsCount);
    /* socket.on ("disconnect", () => {
        console.log("El socket " + socket.id + "se ha desconectado");
    }) */

    /* socket.conn.once("upgrade", () => {
        console.log("Hemos pasado de HTTP Long-Polling a ", socket.conn.transport.name);
    }); */

    // Envia emit a cliente
    socket.emit("welcome", "Ahora estás conectado  Jorge 😎...");

    // Recibe emit del servidor
    socket.on("server", data => {
        console.log(data);
    });

    // Emisión a todos
    io.emit("everyone", socket.id + " se ha conectado 👀")
    
});

httpServer.listen(3000);