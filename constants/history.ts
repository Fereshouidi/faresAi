import { MessageParams } from "../types.js";
import { primaryPrompt } from "./prompts.js";

export const defaultHistory = [
    {
        role: "user",
        parts: [{ text: primaryPrompt }],
    },
    {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
] as MessageParams[];