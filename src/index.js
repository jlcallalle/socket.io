//process.env.DEBUG = "*";
// process.env.DEBUG = "engine, socket.io:socket, socket.io:client";
const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer);
const io = new Server(httpServer, {
    cors: {
        // origin: ["https://invex.modyo.be/", "https://c7a3-179-6-171-28.ngrok.io"],
        origin: 'https://invex.modyo.be',
        credentials: true
    }
});

// habilitar usar admin.ui
/* instrument(io, {
    auth: false
}); */

instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2a$12$T3TafGkHPG57LD5jbsynQ.0zBmXjKB.VJG6fj5ekz/DEBxDk768.i"
    }
});

app.use( express.static(path.join(__dirname, "views")) );

const socketsOnline = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/sala.html");
});

io.on("connection", socket => {

    socketsOnline.push(socket.id);

    // Información Servidor
    console.log('websocket Server');
    // console.log('socket handshake', socket.handshake);
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
    io.emit("everyone", socket.id + " se ha conectado 👀");

    // Emisión a uno solo
    socket.on("last", message => {

        const lastSocket = socketsOnline[ socketsOnline.length - 1 ];
        io.to(lastSocket).emit("salute", message);

    })
    
});

// ejemplo circulo Eento broadcast (envia evento a todos los usuarios conectados )
io.on("connection", socket => {

    socket.on("circle position", position => {
        socket.broadcast.emit("move circle", position);
    });

});

// ejemplo socket salas
io.on("connection", socket => {

    socket.connectedRoom = ""; 
    // guardar sala ala que estoy conectado 

    socket.on("connect to room", room => {
        // retirar de sala
        socket.leave(socket.connectedRoom);

        switch (room) {

            case "room1":
                socket.join("room1");
                socket.connectedRoom = "room1";
                break;

            case "room2":
                socket.join("room2");
                socket.connectedRoom = "room2";
                break;

            case "room3":
                socket.join("room3");
                socket.connectedRoom = "room3";
                break;

        }

    });

    socket.on("message", message => {

        const room = socket.connectedRoom;

        io.to(room).emit("send message", {
            message,
            room
        });

    });

});

// NAMESPACES

const teachers = io.of("teachers");
const students = io.of("students");

teachers.on("connection", socket => {

    console.log(socket.id + " se ha conectado a la sala de profes");

    socket.on("send message", data => {
        teachers.emit("message", data);
    });

});

students.on("connection", socket => {

    console.log(socket.id + " se ha conectado a la sala de estudiantes");

    socket.on("send message", data => {
        students.emit("message", data);
    });

});

// OFFLINE

io.on("connection", socket => {

    socket.on("is connected", msg => {
        console.log(msg);
    })

});

httpServer.listen(3000);
