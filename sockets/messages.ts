import { Server, Socket } from 'socket.io';
import { getConversationById, getConversationLength } from '../controller/conversation.js';
import Message from '../models/message.js';
import { MessageParams } from '../types.js';
import { custimizeUserMessage } from '../constants/promptsComponnent/userMessage.js';
import { getLastMessage, getTextAnswer } from '../controller/message.js';
import { getAnswer_ } from '../midController/socket.io/messages.js';

export default function messagesSocket(socket: Socket, io: Server) {

  socket.on('send-message', async ({ conversationId, message, isWaiting, model }) => {
    getAnswer_(socket,  conversationId, message, isWaiting, model );
  });
  
}
