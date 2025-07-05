import { GoogleGenAI } from "@google/genai";
import { MessageParams, MessageParamsForChatGPt, MessageParamsForDeepSeek, MessagePartsParams } from "../types.js";
import { getConversationById, updateConversationById } from "./conversation.js";
import Message from "../models/message.js";
import { primaryPrompt } from "../constants/prompts.js";
import { messagePartsSchema } from "../models/message.js";
import { json } from "stream/consumers";
import { checkSymbols } from "./functionalSymbols.js";
import { custimizeUserMessage } from "../constants/promptsComponnent/userMessage.js";
import { getUserByConversation, getUserById } from "./user.js";
import { error } from "console";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { defaultHistory } from "../constants/history.js";
import OpenAI from "openai";


export const createDefaultMessages = async () => {

    try {

        const existingPrimaryPrompt = await Message.findOne({ type: "primaryPrompt" });
        const existingPrimaryResponse = await Message.findOne({ type: "primaryResponse" });

        if (!existingPrimaryPrompt) {
            new Message({
                role: "user",
                parts: [{ text: primaryPrompt }],
                type: "primaryPrompt",
            }).save();
        }

        if (!existingPrimaryResponse) {
            new Message({
                role: "model",
                parts: [{ text: "ok, i'm ready" }],
                type: "primaryResponse",
            }).save();
        }

    } catch (error) {
        console.error("Error creating default messages:", error);
    }
}


export const createMessage = async (conversationId: string, role: string, parts: MessagePartsParams[], type: string) => {
    
    if (!conversationId) {
        throw new Error("Conversation ID is required");
    }
    try {

        const newMessage = new Message({
                role,
                parts,
                type,
                conversation: conversationId,
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

export async function getTextAnswer(conversationId: string, model: string, history: MessageParams[], message: string, isWaiting: boolean) {
            
    try {

        const conversation = await getConversationById(conversationId);

        if (!conversation || !conversation.user) {
            return error('something went wrong while using "getConversationById()" !') 
        }

        let custimizedUserMessage = await custimizeUserMessage(conversation.user, conversationId, '', isWaiting); 

        if (!message.includes('<precedureResult>')) {
            custimizedUserMessage = await custimizeUserMessage(conversation.user, conversationId, message, isWaiting);
        }
        
        
        const historyWithLastMessage = [
            ...history, 
            {role: 'model', parts: [{text: "<tellUserToWait>loading...</tellUserToWait>"}]},
        ] as MessageParams[];

        let response: string | undefined | null = '';

        if (!isWaiting && !message.includes('<precedureResult>')) {
            response = await getAnswerFromGemini(model, history, custimizedUserMessage);
        } else if (isWaiting && !message.includes('<precedureResult>')) {
            response = await getAnswerFromGemini(model, historyWithLastMessage, custimizedUserMessage);
        } else if (message.includes('<precedureResult>')) {
            response = await getAnswerFromGemini(model, historyWithLastMessage, message);
        }
        
        if (!response) {
            throw 'something went wrong while generating response !'
        }

        const res = await checkSymbols(response);

        if (!res) {
            return error('there is not res afterchecking Symbols !');
        }

        if (res?.includes('<tellUserToWait>')) {
            
            // const newMessage = await createMessage(conversationId, "user", [{ text: message }], "text");
            return res;
            
        }

        if (!res?.includes('<precedureResult>')) {

            // const newMessage = await createMessage(conversationId, "user", [{ text: message }], "text");
            // const message
            const newResponse = await createMessage(conversationId, "model", [{ text: res }], "text");
            return res;
            
        } else {
            // console.log([custimizedUserMessage]);
            
            const historyWithLastMessage = [
                ...history, 
                {role: 'model', parts: [{text: "<tellUserToWait>loading...</tellUserToWait>"}]},
                {role: 'user', parts: [{text: ''}]},
                {role: 'model', parts: [{text: response}]}
            ] as MessageParams[];

            return getTextAnswer(conversationId, model, historyWithLastMessage, res, isWaiting);
        }

    } catch (err) {
        console.error("Error occurred while getting answer:", err);
        return {err}
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
        apiKey: process.env.GEMINI_KEY,
    });
    
    const customizedHistory = history.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(p => ({
            text: p.text || ""
        }))
    }));


    // console.log([...defaultHistory, ...custimizedHistory]);
    

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

// export const getAnswerFromDeepSeek = async (model: string, history: MessageParams[], custimizedUserMessage: string) => {    

//     const token = proccess.env.GITHUP_AI_Key;
//     const endpoint = "https://models.github.ai/inference";
//     const model_ = "deepseek/DeepSeek-R1";

//     const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    
//     try {

//         const custimizedHistory = [

//             {role: "user", content: primaryPrompt},
//             {role: "system", content: 'ok i am ready'},

//             ...history.map(item => ({
//                 role: item.role == 'model' ? 'system' : 'user',
//                 content: item.parts?.[0]?.text || ""
//             })) as MessageParamsForChatGPt[],

//             {role: "user", content: custimizedUserMessage}

//         ] as MessageParamsForChatGPt[];

//         const response = await client.chat.completions.create({
//             messages: [
//                 ...custimizedHistory,
//                 {role: "user", content: custimizedUserMessage},
//             ],
//             temperature: 1.0,
//             top_p: 1.0,
//             max_tokens: 2000,
//             stream: false,
//             model: model_
//         });

//         return response.choices[0].message.content;

//     } catch (err) {
//         throw error('error while getting answer from deepseek', err);
//     }


// }

export const getMessagesByContent = async (conversationId: string | object, searchTerm: string) => {

    if (!conversationId) {
        return error('conversationId is required');
    }

    try {
        const conversationPart = await Message.find({
            "parts.text": { $regex: new RegExp(searchTerm, "i") }
        })
        .sort({ createdAt: 1 });

        return conversationPart?? `something went wrong while fetching messages that have content like "${searchTerm}" . try another searchTerm .`;

    } catch (err) {
        return error(err);
    }
}