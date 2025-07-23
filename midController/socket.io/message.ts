import { createMessage, getLastMessage, getTextAnswer } from "../../controller/socket/message.js";
import Message from "../../models/message.js";
import { createConversation, getConversationById, getConversationLength } from "../../controller/socket/conversation.js";
// import { defaultHistory } from "../../constants/history.js";
import { ConversationParams, MessageParams } from "../../types.js";
// import { primaryPrompt } from "../../constants/prompts.js";
import { custimizeUserMessage } from "../../constants/promptsComponnent/userMessage.js";
// import { ObjectId } from "mongoose";
import { Socket } from "socket.io";
import { createConversationTittle } from "../../helper.js";

export const getAnswer_ = async (
    socket: Socket,
    conversationId: string, 
    userId: string,
    message: string, 
    isWaiting: boolean,
    model: string
) => {


    console.log({ conversationId, userId, message, isWaiting, model });
    
    try {

      let conversation =  null as unknown as ConversationParams;

      if (conversationId) {

        conversation = await getConversationById(conversationId) as ConversationParams;

      } else {
        const conversationTittle = await createConversationTittle(message) as unknown as string;
        console.log({conversationTittle});
        
        conversation = await createConversation(userId, conversationTittle) as ConversationParams;
        socket.emit('add-conversation', {newConversation: conversation});
      }

      console.log({conversation});

      if (!conversation) {
        console.log('Conversation not found or could not be created.');
        return socket.emit('receive-message', { error: 'Conversation not found or could not be created.' });
      }

      const history = await Message.find({ conversation: conversation._id })
        .limit(10)
        .sort({ createdAt: -1 }) as MessageParams[];

      const orderedHistory = history.reverse();

      const customizedUserMessage = await custimizeUserMessage(
        conversation.user,
        String(conversation._id),
        message,
        isWaiting
      );

      await createMessage(
        String(conversation._id), 
        String(conversation.user), 
        'user', 
        [{text: message}], 
        'text', 
        socket
      ) as MessageParams;

      const answer = await getTextAnswer(
        String(conversation._id),
        String(conversation.user),
        model,
        orderedHistory,
        customizedUserMessage,
        isWaiting,
        socket
      );

      const lastMessage = await getLastMessage(String(conversation._id));
      const messageIndex = (await getConversationLength(conversation._id)) as number - 1;

    //   socket.emit('receive-message', { answer: lastMessage, messageIndex });

    } catch (err) {
      console.error(err);
      socket.emit('receive-message', { error: 'Internal server error' });
    }
    
}
