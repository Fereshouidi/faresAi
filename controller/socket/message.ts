import { GoogleGenAI } from "@google/genai";
import { ConversationParams, MessageParams, MessageParamsForChatGPt, MessageParamsForDeepSeek, MessagePartsParams } from "../../types.js";
import { getConversationById, getConversationLength, updateConversationById } from "./conversation.js";
import Message from "../../models/message.js";
import { primaryPrompt } from "../../constants/prompts.js";
import { checkSymbols } from "../functionalSymbols.js";
import { error } from "console";
import { defaultHistory } from "../../constants/history.js";
import OpenAI from "openai";
import { getPureModelMessage, getPureUserMessage, isOnlyTellUserToWaitTag } from "../../utils/helper.js";
import { Socket } from "socket.io";
import { ObjectId } from "mongoose";
import { maxMessageToGet } from "../../constants/maxMessage.js";

export const createMessage = async (conversationId: string | ObjectId, userId: string | ObjectId, role: string, parts: MessagePartsParams[], type: string, socket?: Socket,) => {
    
    if (!conversationId) {
        throw new Error("Conversation ID is required");
    }
    try {

        const messageIndex = (await getConversationLength(conversationId)) as number - 1;

        const newMessage = new Message({
                role,
                parts,
                index: messageIndex,
                type,
                conversation: conversationId,
                user: userId
            }).save();
            

        if (newMessage) {
            return newMessage;
        } else {
            throw new Error("Failed to create message");
        }

    } catch (err) {
        return { err };
    }
}

export async function getTextAnswer(
    conversation: ConversationParams,
    model: string,
    history: MessageParams[],
    message: string,
    isWaiting: boolean,
    socket: Socket
) {
    try {
        let temporaryMemory = [...history] as MessageParams[];
        let currentMessage = message;
        let numOfTry = 0;

        while (numOfTry < 5) {

            const aiResult = await getAnswerFromGemini(model, temporaryMemory, currentMessage);

            if (!aiResult) {
                console.error('Something went wrong while getting response from the model!');
                socket.emit('receive-message', { error: 'Something went wrong while getting response from AI!' });
                throw new Error('Failed to get response from AI');
            }

            const symbolsResult = await checkSymbols(aiResult, socket);

            if (!symbolsResult) {
                console.error('No symbols found after analyzing the response!');
                socket.emit('receive-message', { error: 'No symbols found after analyzing the response!' });
                throw new Error('Symbol analysis failed');
            }

            if (aiResult.includes('<messageToUser>')) {
                const newAiResponseStart = aiResult.indexOf('<messageToUser>') + '<messageToUser>'.length;
                const newAiResponseEnd = aiResult.indexOf('</messageToUser>');
                const newAiResponse = aiResult.slice(newAiResponseStart, newAiResponseEnd).trim();

                const newMessage = await createMessage(
                    String(conversation._id),
                    String(conversation.user),
                    'model',
                    [{ text: newAiResponse }],
                    'text',
                    socket
                ) as MessageParams;

                const conversationLength =  await getConversationLength(conversation._id);

                if (newMessage) {
                    socket.emit('receive-message', {
                        answer: newMessage,
                        messageIndex: conversationLength
                    });
                    const updatedConversation = {...conversation, length: conversationLength}
                    socket.emit('get-updated-conversation', updatedConversation);
                }
            }

            if (aiResult.includes('<tellUserToWait>')) {
                const messageToWaitStart = aiResult.indexOf('<tellUserToWait>') + '<tellUserToWait>'.length;
                const messageToWaitEnd = aiResult.indexOf('</tellUserToWait>');
                const messageToWait = aiResult.slice(messageToWaitStart, messageToWaitEnd).trim();

                socket.emit('receive-message', { messageToWait });

                if (isOnlyTellUserToWaitTag(aiResult)) {
                    
                    temporaryMemory.push({
                        role: "model",
                        parts: [{ text: aiResult }],
                        index: (await getConversationLength(conversation._id))?? 0
                    });

                    currentMessage = 'answer me';
                    continue;
                }
            }

            if (symbolsResult.includes('<precedureResult>')) {
                const start = symbolsResult.indexOf('<precedureResult>') + '<precedureResult>'.length;
                const end = symbolsResult.indexOf('</precedureResult>');
                const content = symbolsResult.slice(start, end).trim();

                temporaryMemory.push({
                    role: "model",
                    parts: [{ text: aiResult }],
                    index: await getConversationLength(conversation._id) ?? 0
                });

                currentMessage = symbolsResult;
                continue;
            }

            if (aiResult.includes('<empty>')) {
                return socket.emit('receive-message', {
                    answer: '',
                    messageIndex: 0
                });
            }

            numOfTry++;
            break;
        }


    } catch (err) {
        console.error("Error:", err);
        return socket.emit('receive-message', {
            answer: 'Something went wrong while getting answer from ai !',
            messageIndex: 0
        });    
    }
}

export const updatePrimaryPrompt = async (prompt: string) => {

    try {
        await Message.findOneAndUpdate(
            {type: 'primaryPrompt'},
            {parts: [{text: prompt}] },
            {new: true}
        )

        return 'the primary prompt has been updated succesfully';
        
    } catch (err) {
        return error('something went wrong while updating the primary prompt !')
    }
}

export const getAnswerFromGemini = async (model: string, history: MessageParams[], customizedUserMessage: string) => {

    const ai = new GoogleGenAI({
        apiKey: "AIzaSyDjLld0ynrVEvbIFK3inQCp4tR3UEScaxs",
    });
    
    const customizedHistory = history.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(p => ({
            text: p.text || ""
        }))
    }));

    const chat = ai.chats.create({
        model,
        history: [...defaultHistory, ...customizedHistory]
    });

    const response = await chat.sendMessage({
        message: customizedUserMessage,
    });

    return response.text;
}

export const getAnswerFromDeepSeek = async (model: string, history: MessageParams[], custimizedUserMessage: string) => {    

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPEN_ROUTER_Key,
    });
    
    try {

        const custimizedHistory = [

            {role: "user", content: primaryPrompt},
            {role: "assistant", content: 'ok i am ready'},

            ...history.map(item => ({
                role: item.role == 'model' ? 'assistant' : 'user',
                content: item.parts?.[0]?.text || ""
            })) as MessageParamsForDeepSeek[],

            {role: "user", content: custimizedUserMessage}

        ] as MessageParamsForDeepSeek[];

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528:free",
            messages: custimizedHistory,
            // max_tokens: 1000,
            
        });

        return completion.choices[0].message.content;

    } catch (err) {
        throw error('error while getting answer from deepseek', err);
    }


}

export const getMessagesByContent = async (
  conversationId: string | object,
  searchTerm: string,
  page: number = 1,
  limit: number = maxMessageToGet
) => {

  if (!conversationId) {
    return error('conversationId is required');
  }

  try {
    const totalMessages = await Message.countDocuments({
      conversationId,
      "parts.text": { $regex: new RegExp(searchTerm, "i") }
    });

    const totalPages = Math.ceil(totalMessages / limit);

    const conversationPart = await Message.find({
      conversationId,
      "parts.text": { $regex: new RegExp(searchTerm, "i") }
    })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      page,
      totalPages,
      totalMessages,
      results: conversationPart
    };

  } catch (err) {
    return error(err);
  }
};

export const getLastMessage = async (conversationId: string) => {

    if (!conversationId) {
        return error('conversationId is required');
    }

    try {
        const lastMessage = await Message.findOne({conversation: conversationId})
        .sort({ createdAt: -1 });

        return lastMessage;
    } catch (err) {
        return error(err);
    }
}

export const deleteMessages = async (ids: (string | object)[]) => {

    if (!ids) {
        return error('messages ids is required');
    }

    try {
        await Message.deleteMany({ _id: { $in: ids } });

        return `${ids.length} message has been removed`;
    } catch (err) {
        return error(err);
    }
}