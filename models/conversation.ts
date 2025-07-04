import mongoose from "mongoose";
import { title } from "process";
import { MessageParams } from "../types.js";
import { primaryPrompt } from "../constants/prompts.js";

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        default: "New Conversation",
    },
    model: {
        type: String,
        default: "gemini-2.5-flash",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;