// import express from "express";
// import { createMessage, getTextAnswer } from "../../controller/endpoint/message.js";
// import Message from "../../models/message.js";
// import { getConversationById, getConversationLength } from "../../controller/endpoint/conversation.js";
// import { defaultHistory } from "../../constants/history.js";
// import { MessageParams } from "../../types.js";
// import { primaryPrompt } from "../../constants/prompts.js";
// import { custimizeUserMessage } from "../../constants/promptsComponnent/userMessage.js";

// export const getAnswer_ = async (
//     // @ts-ignore
//     req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//     // @ts-ignore 
//     res: Response<any, Record<string, any>, number>
// ) => {

//     const {conversationId, message, isWaiting, model} = req.body;

//     try {
//         if (!conversationId) {
//             res.status(404).json({error: 'conversation is not found !'})
//         }
        
//         const history = await Message.find({ conversation: conversationId })
//             .limit(10)
//             .sort({ createdAt: -1 }) as MessageParams[];

//         const orderedHistory = history.reverse();

//         const conversation = await getConversationById(conversationId);

//         if (!conversation) {
//             res.status(404).json({error: "Conversation not found."});
//             return;
//         }

//         const custimizedUserMessage = await custimizeUserMessage(conversation.user, conversationId, message, isWaiting); 

//         const answer = await getTextAnswer(conversationId, model, orderedHistory, custimizedUserMessage, isWaiting);

//         const messageIndex = await getConversationLength(conversationId) as number - 1;

//         res.status(200).json({answer, messageIndex});

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({error: err});
//     }
    
    
// }
