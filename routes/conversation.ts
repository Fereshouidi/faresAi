import express from "express";
import { createConversation, getConversationSlice } from "../controller/endpoint/conversation.js";
import Conversation from "../models/conversation.js";
import { getConversationSlice_ } from "../midController/endPoint/conversation.js";

const router = express.Router();

// router.post("/createConversation", async (req, res) => {
//     // createConversation_(req, res);
// })

// router.get("/getConversationsByUserId", async (req, res) => {
//     getConversationsByUserId_(req, res);
// })

router.get("/getConversationSlice", async (req, res) => {
    getConversationSlice_(req, res);
})



export default router;

