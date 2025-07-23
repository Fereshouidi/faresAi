import { Server } from 'socket.io';
import messageSocket from './message.js';
import conversationSocket from './conversation.js';

export default function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    messageSocket(socket, io);

    conversationSocket(socket, io);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
