const socket = io();
const contenedor = document.getElementById('contenedor');

socket.on("connect", () => {
    console.log("El socket  se ha conectado ", socket.id);
    const item = document.createElement('span');
        item.textContent = socket.id;
        contenedor.appendChild(item);
})