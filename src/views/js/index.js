// const socket = io();
const socket = io("http://localhost:3000/", { forceNew: true })
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