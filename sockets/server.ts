import { Server } from 'socket.io';
import messagesSocket from './messages.js';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    messagesSocket(socket, io);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
