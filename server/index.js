import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const users = {}; // Almacenar usuarios con sus nombres

io.on("connection", (socket) => {
  socket.on("setUsername", (username) => {
    users[socket.id] = username; // Asociar nombre de usuario con socket.id
  });

  socket.on("message", (body) => {
    const from = users[socket.id] || socket.id.slice(6);
    io.emit("message", { body, from });
  });

  socket.on("disconnect", () => {
    delete users[socket.id]; // Eliminar el usuario cuando se desconecta
  });
});

server.listen(4000);
console.log("Server on port", 4000);
