import express from "express";
import { createMessage, getLastMessage, getTextAnswer } from "../../controller/message.js";
import Message from "../../models/message.js";
import { getConversationById, getConversationLength } from "../../controller/conversation.js";
import { defaultHistory } from "../../constants/history.js";
import { MessageParams } from "../../types.js";
import { primaryPrompt } from "../../constants/prompts.js";
import { custimizeUserMessage } from "../../constants/promptsComponnent/userMessage.js";
import { ObjectId } from "mongoose";
import { Socket } from "socket.io";

export const getAnswer_ = async (
    socket: Socket,
    conversationId: string, 
    message: string, 
    isWaiting: boolean,
    model: string
) => {


    console.log({ conversationId, message, isWaiting, model });
    
    try {

      if (!conversationId) {
        return socket.emit('receive-message', { error: 'Conversation ID is required.' });
      }

      const conversation = await getConversationById(conversationId);
      if (!conversation) {
        return socket.emit('receive-message', { error: 'Conversation not found.' });
      }

      const history = await Message.find({ conversation: conversationId })
        .limit(10)
        .sort({ createdAt: -1 }) as MessageParams[];

      const orderedHistory = history.reverse();

      const customizedUserMessage = await custimizeUserMessage(
        conversation.user,
        conversationId,
        message,
        isWaiting
      );

      const answer = await getTextAnswer(
        conversationId,
        model,
        orderedHistory,
        customizedUserMessage,
        isWaiting,
        socket
      );

      const lastMessage = await getLastMessage(conversationId);
      const messageIndex = (await getConversationLength(conversationId)) as number - 1;

      socket.emit('receive-message', { answer: lastMessage, messageIndex });

    } catch (err) {
      console.error(err);
      socket.emit('receive-message', { error: 'Internal server error' });
    }
    
}
