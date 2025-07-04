import { error } from "console";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { primaryPrompt } from "../constants/prompts.js";
import { createDefaultMessages } from "./message.js";

export const getConversationById = async (id: string) => {
    if (!id) {
        return error('ID is required');
    }

    try {
        const conversation = await Conversation.findOne({_id: id});
        if (conversation) {
            return conversation
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

export const createConversation = async (userId: string, ) => {

    if (!userId) {
        return error('userId is required');
    }

    try {

        const conversation = await new Conversation({
            user: userId,
        }).save();

        if (conversation) {
            return conversation
        } else {
            return null;
        }

    } catch (err) {
        throw err;
    }
}

export const updateConversationById = async (id: string, updateData: object) => {

    if (!id) {
        return error('ID is required');
    }

    try {
        const updatedConversation = await Conversation.findOneAndUpdate({_id: id}, updateData, {new: true});
        if (updatedConversation) {
            return updatedConversation;
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

export const getConversationSlice = async (conversationId: string | object, start: number, end: number) => {
    
    if (!conversationId) {
        return error('conversationId is required');
    }

    try {
        const conversationPart = await Message.find({
            conversation: conversationId
        })
        .sort({ createdAt: 1 })
        .skip(start)
        .limit(end - start +1);


        return conversationPart?? `something went wrong while fetching messages from ${start} to ${end} . try another range`;

    } catch (err) {
        console.log(err);
        return error(err);
    }
}

export const getConversationLenght = async (conversationId: string | object) => {
    try {
        const lenght = await Message.countDocuments({ $or: [
            { conversation: conversationId },
            // { type: "primaryPrompt" },
            // { type: "primaryResponse" }
        ] })

        return lenght;

    } catch (err) {
        return error('something went wrong while getting the index of the message in the conversation !')
    }
}