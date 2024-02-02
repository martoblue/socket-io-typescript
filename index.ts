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

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// Habilitar los CORS para las rutas express
app.use(cors());

// Evento de conexión: se dispara cada vez que un cliente se conecta
io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  // Uniendo automaticamente al usuario a la sala "general"
  socket.join('general');

  // Manejando el Evento join room para unirse a una sala privada
  socket.on('join room', (room: string) => {
    // leaveAllRoomsExceptGeneral(socket); // El usuario se salga de todas las salas excepto la general
    socket.leave('general');
    socket.join(room); // Uniendose a una sala privada
    console.log(`User has joined a room: ${room}`);
  });

  // Manejando el evento 'join general' para regresar a la sale general
  socket.on('join general', () => {
    leaveAllRoomsExceptGeneral(socket);
    socket.join('general');
  });

  // Evento personalizado 'chat message' para recibir mensajes del cliente
  socket.on('chat message', (data: { room: string; userName: string; message: string }) => {
    // Emitiendo el mensaje a todos los usuarios de una sala especifica
    io.to(data.room).emit('chat message', data);
  });

  // Evento de desconexión: se dispara cuando un cliente se desconecta
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

function leaveAllRoomsExceptGeneral(socket: Socket) {
  socket.rooms.forEach((room) => {
    if (room !== 'general' && room !== socket.id) {
      socket.leave(room);
    }
  });
}

// Iniciar el servidor para escuchar en el puerto 3000
server.listen(port, () => {
  console.log(` Listening on port ${port}!`);
});
