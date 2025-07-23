import { GoogleGenAI } from "@google/genai";
import { MessageParams } from "../../types";
import { primaryChatForProcedureAgent } from "../../constants/history";
import { checkSymbols } from "./checkSymbols";


type Message = {
    role: string;
    parts: { text: string }[];
}

export const getProcedureResultFromAgent = async (order: string, history?: Message[]) => {

    const temporaryMemory = history ?? [];

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_KEY,
    });

    const chat = ai.chats.create({
        model: "gemini-2.5-pro",
        history: [...primaryChatForProcedureAgent, ...temporaryMemory],
    });

    const response = await chat.sendMessage({
        message: order,
    });

    

    await checkSymbols(response.text);

}


