import { MessageParams } from "../types.js";
import { primaryPrompt, primaryPromptForProcedureAgent } from "./prompts.js";

export const defaultHistory = [
    {
        role: "user",
        parts: [{ text: primaryPrompt }],
    },
    {
        role: "model",
        parts: [{ text: "Great , let's get started!" }],
    },
] as MessageParams[];

export const primaryChatForProcedureAgent = [
    {
        role: "user",
        parts: [
            { text: primaryPromptForProcedureAgent }
        ]
    },
    {
        role: "model",
        parts: [
            { text: "great, let's get started ." }
        ]
    }   
]