// import { Server } from "socket.io";
// import { getLastMessage, getTextAnswer } from "./controller/message";
// import Message from "./models/message";
// import { MessageParams } from "./types";
// import { getConversationById, getConversationLength, getConversationSlice } from "./controller/conversation";
// import { custimizeUserMessage } from "./constants/promptsComponnent/userMessage";

// const io = new Server(3000);

// io.on('connection', socket => {

//   console.log('hi');
  

//   socket.on('send-message', async ({ conversationId, message, isWaiting, model }) => {
//     try {

//       if (!conversationId) {
//         return socket.emit('receive-message', { error: 'Conversation ID is required.' });
//       }

//       const conversation = await getConversationById(conversationId);
//       if (!conversation) {
//         return socket.emit('receive-message', { error: 'Conversation not found.' });
//       }

//       const history = await Message.find({ conversation: conversationId })
//         .limit(10)
//         .sort({ createdAt: -1 }) as MessageParams[];

//       const orderedHistory = history.reverse();

//       const customizedUserMessage = await custimizeUserMessage(
//         conversation.user,
//         conversationId,
//         message,
//         isWaiting
//       );

//       const answer = await getTextAnswer(
//         conversationId,
//         model,
//         orderedHistory,
//         customizedUserMessage,
//         isWaiting
//       );

//       const lastMessage = await getLastMessage(conversationId);
//       const messageIndex = (await getConversationLength(conversationId)) as number - 1;

//       socket.emit('receive-message', { answer: lastMessage, messageIndex });

//     } catch (err) {
//       console.error(err);
//       socket.emit('receive-message', { error: 'Internal server error' });
//     }
//   });
// })



// export default io;