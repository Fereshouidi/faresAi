import express from "express";
import { createMessage, getTextAnswer } from "../controller/message.js";
import Message from "../models/message.js";
import { getConversationById, getConversationLenght } from "../controller/conversation.js";
import { defaultHistory } from "../constants/history.js";
import { MessageParams } from "../types.js";
import { primaryPrompt } from "../constants/prompts.js";

const router = express.Router();

router.post("/getAnswer", async (req, res) => {

    const {conversationId, message, isWaiting, model} = req.body;

    try {
        if (!conversationId) {
            res.status(404).json({error: 'conversation is not found !'})
        }
        if (!message && message != '') {
            res.status(404).json({error: "you didn't send any message !!!"})
        }

        if (!isWaiting) {
            const newMessage = await createMessage(conversationId, "user", [{ text: message }], "text");
        }

        const history = await Message.find({ conversation: conversationId })
            .limit(6)
            .sort({ createdAt: -1 }) as MessageParams[];

        const orderedHistory = history.reverse();

        // const history = [...defaultHistory, ...restOfHistory]

        // console.log({history: history[0].parts});
        

        // if (history.length === 0) {
        //     throw new Error("No messages found for this conversation.");
        // }

        const conversation = await getConversationById(conversationId);

        if (!conversation) {
            res.status(404).json({error: "Conversation not found."});
            return;
        }

        const answer = await getTextAnswer(conversationId, model, orderedHistory, message, isWaiting);
        const messageIndex = await getConversationLenght(conversationId) as number - 1;

        res.status(200).json({answer, messageIndex});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
    
    
})

export default router;