import 'dotenv/config';
import express from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';

// Crear una instancia de express para configurar el servidor de HTTP

const app = express();
const server = http.createServer(app);
const port = process.env.PORT ?? 3030;

// Crear una instancia de socket.io para configurar el servidor de WebSocket

// TODO: Habilitar el acceso al cliente, configurar el objeto {}
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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

// Iniciar el servidor para escuchar en el puerto 3000
server.listen(port, () => {
  console.log(` Listening on port ${port}!`);
});
