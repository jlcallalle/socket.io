// const socket = io();
// const socket = io("http://localhost:3000/", { forceNew: true });
const socket = io({
    auth: {
        token: "Mr. Michi es genial"
    }
});

// En caso de error en el middleware
socket.on("connect_error", err => {

    console.log("Error de conexión 😵‍💫");
    console.log(err.message);
    console.log(err.data.details);

});

// const socket = io("https://c7a3-179-6-171-28.ngrok.io", { forceNew: true });
const contenedor = document.getElementById('contenedor');

function checkSocketStatus() {
    console.log("Estado del socket: ", socket.connected);
}

socket.on("connect", () => {
    console.log("El socket  se ha conectado ", socket.id);
    checkSocketStatus();
    const item = document.createElement('span');
        item.textContent = socket.id;
        contenedor.appendChild(item);
})

socket.on("connect_error", () => {
    console.log("No pude conectarme 😔");
})

socket.on("disconnect", () => {
    console.log("El socket se ha desconectado: ", socket.id);
    checkSocketStatus();
});

socket.io.on("reconnect_attempt", () => {
    console.log("Estoy intentado reconectarme 🤪");
});

socket.io.on("reconnect", () => {
    console.log("¡Me he vuelto a conectar! 😎");
});

// recibe emit del servidor 
socket.on("welcome", data => {
    const text = document.querySelector("#text");
    text.textContent = data;
    console.log(data);
});

// renvia emit al servidor
const emitToServer = document.querySelector("#emit-to-server");
emitToServer.addEventListener("click", () => {

    socket.emit("server", "Hola, servidor 👀");

});


socket.on("everyone", message => {
    console.log(message);
});


// renvia emit al último conectado
const emitToLast = document.querySelector("#emit-to-last");
emitToLast.addEventListener("click", () => {

    socket.emit("last", "Hola 😄");

});


socket.on("salute", message => {
    console.log(message);
});


// Evento Circulo

const circle = document.querySelector("#circle");

const drawCircle = position => {
    circle.style.top = position.top;
    circle.style.left = position.left;
}

const drag = e => {
    // console.log(e);
    const position =  {
        top: e.clientY + "px",
        left: e.clientX + "px"
    };

    drawCircle(position);
    socket.emit("circle position", position);
    console.log("Se envia el evento al servidors");
    socket.volatile.emit("circle position", position);


}

document.addEventListener("mousedown", e => {
    document.addEventListener("mousemove", drag)
});

document.addEventListener("mouseup", e => {
    document.removeEventListener("mousemove", drag);
});

socket.on("move circle", position => {
    drawCircle(position);
});
