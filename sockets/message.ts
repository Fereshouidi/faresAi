import { Server, Socket } from 'socket.io';
import { getAnswer_ } from '../midController/socket.io/message.js';

export default function messageSocket(socket: Socket, io: Server) {

  socket.on('send-message', async ({ conversationId, userId, message, isWaiting, model }) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    
    getAnswer_(socket,  conversationId, userId, message, isWaiting, model );
  });
  
}
