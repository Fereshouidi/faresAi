import { createMessage, getLastMessage, getTextAnswer } from "../../controller/socket/message.js";
import Message from "../../models/message.js";
import { createConversation, getConversationById, getConversationLength } from "../../controller/socket/conversation.js";
import { ConversationParams, MessageParams, UserParams } from "../../types.js";
import { custimizeUserMessage } from "../../constants/promptsComponnent/userMessage.js";
import { Socket } from "socket.io";
import { createConversationTittle } from "../../utils/helper.js";
import { maxMessageToGet } from "../../constants/index.js";
import { summarizeConversation_updateNotes } from "../../agents/summeryAgent/agent.js";
import User from "../../models/user.js";

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

      const user = await User.findOne({_id: userId}) as UserParams;

      let conversation =  null as unknown as ConversationParams;

      if (conversationId) {

        conversation = await getConversationById(conversationId) as ConversationParams;

      } else {
        const conversationTittle = await createConversationTittle(message) as unknown as string;        
        conversation = await createConversation(userId, conversationTittle) as ConversationParams;
        conversation = {...conversation, length: 1}
        socket.emit('add-conversation', {newConversation: conversation});
      }

      if (!conversation || conversation.summary === 'undefined' !) {
        console.log('Conversation not found or could not be created.');
        return socket.emit('receive-message', { error: 'Conversation not found or could not be created.' });
      }

      const history = await Message.find({ conversation: conversation._id })
        .limit(maxMessageToGet)
        .sort({ createdAt: -1 }) as MessageParams[];

      console.log({conversation});
      
      const conversationLength = (await getConversationLength(conversation._id)) as number - 1;

      if ( conversationLength == maxMessageToGet || (conversationLength % maxMessageToGet) == 0) {

        socket.emit('receive-message', { messageToWait: 'summarazing' });
        const summarizedConversation = (await summarizeConversation_updateNotes(conversation, history, user)).summary;
        conversation.summary = summarizedConversation || conversation.summary;
        
      }

      const orderedHistory = history.reverse();

      const customizedUserMessage = await custimizeUserMessage(
        conversation,
        user,
        conversation.summary?? 'there is no summary !',
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
        conversation,
        model,
        orderedHistory,
        customizedUserMessage,
        isWaiting,
        socket
      );

      // const lastMessage = await getLastMessage(String(conversation._id));
      // const messageIndex = (await getConversationLength(conversation._id)) as number - 1;

    //   socket.emit('receive-message', { answer: lastMessage, messageIndex });

    } catch (err) {
      console.error(err);
      socket.emit('receive-message', { error: 'Internal server error' });
    }
    
}
