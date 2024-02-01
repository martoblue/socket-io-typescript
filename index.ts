import express from 'express';
import { Server as socketIOServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';

// Crear una instancia de express para configurar el servidor de HTTP

const app = express();
const server = http.createServer(app);

// Crear una instancia de socket.io para configurar el servidor de WebSocket

// TODO: Habilitar el acceso al cliente, configurar el objeto {}
const io = new socketIOServer(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

io.on('connection', (socket: Socket) => {
  console.log('Client connected');

  // Evento personalizado 'chat message' para recibir mensajes del cliente
  socket.on('chat message', (msg) => {
    // Emitir el mensaje recibido a todos los clientes
    io.emit('chat message', msg);
  });

  // Evento de desconexión: se dispara cuando un cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
