import { ObjectId } from "mongoose";

export interface MessageParams {
    role: "user" | "model";
    index: number
    parts: MessagePartsParams[];
    conversation?: ConversationParams | string | ObjectId
    user?: UserParams | string | ObjectId
}

export interface MessageParamsForChatGPt {
    role: "user" | "system";
    content: string;
}

export interface MessageParamsForDeepSeek {
    role: "user" | "assistant";
    content: string;
}

export interface MessagePartsParams {
    text?: string;
    image?: string;
    audio?: string;
    video?: string;
    file?: string;
    toolCall?: object;
    toolResult?: object;
    toolError?: object;
    toolResponse?: object;
    toolResponseError?: object;
}

export interface UserParams {
    _id?: string;
    name: string;
    familyName: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string
}

export interface AiNoteParams {
    _id?: string;
    user: UserParams;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface NoteContentParams {
    title: string;
    text: string;
}

export interface ConversationParams {
    _id: object | string;
    user: UserParams | object | string;
    title?: string;
    summary?: string;
    length?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

