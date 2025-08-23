import express from "express";
import { createConversation, getConversationSlice } from "../controller/endpoint/conversation.js";
import Conversation from "../models/conversation.js";
import { deleteconversation_, editConversation_, getConversationSlice_ } from "../midController/endPoint/conversation.js";

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

router.delete("/deleteConversation", async (req, res) => {
    deleteconversation_(req, res);
})

router.patch('/editConversation', async (req, res) => {
    editConversation_(req, res);
})

// router.patch('/getConversationSlength', async (req, res) => {
//     getConversationSlength_(req, res);
// })



export default router;

