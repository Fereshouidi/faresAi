import express from "express";
// import { createMessage, getTextAnswer } from "../controller/endpoint/message.js";
import Message from "../models/message.js";
import { getConversationById, getConversationLength } from "../controller/endpoint/conversation.js";
import { defaultHistory } from "../constants/history.js";
import { MessageParams } from "../types.js";
import { primaryPrompt } from "../constants/prompts.js";
import { custimizeUserMessage } from "../constants/promptsComponnent/userMessage.js";
// import { getAnswer_ } from "../midController/endPoint/messages.js";

const router = express.Router();

// router.post("/getAnswer", async (req, res) => {
//     getAnswer_(req, res);
// })

export default router;