import { error } from "console";
import Conversation from "../../models/conversation.js";
import Message from "../../models/message.js";

export const getConversationById = async (id: string) => {
    if (!id) {
        return error('ID is required');
    }

    try {
        const conversation = await Conversation.findOne({_id: id}).lean();
        if (conversation) {
            return conversation
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

export const createConversation = async (userId: string, title: string ) => {

    if (!userId) {
        return error('userId is required');
    }

    console.log({title});
    
    try {

        const conversation = await new Conversation({
            user: userId,
            title: title ?? 'new conversation',
        }).save();

        if (conversation) {
            return conversation
        } else {
            return null;
        }

    } catch (err) {
        return err;
    }
}

export const updateConversationById = async (id: string, updateData: object) => {

    if (!id) {
        return error('ID is required');
    }

    try {
        const updatedConversation = await Conversation.findOneAndUpdate({_id: id}, updateData, {new: true}).lean();

            return updatedConversation ? 
            {message: 'Conversation updated successfully', conversation: updatedConversation} :
            {message: 'Conversation not found', conversation: undefined};

    } catch (err) {
        return {err};
    }
}

export const getConversationSlice = async (conversationId: string | object, start: number, end: number, orderedBy: 'asc' | 'desc' = 'asc' ) => {
    
    if (!conversationId) {
        return error('conversationId is required');
    }
    
    try {
        const conversationPart = await Message.find({
            conversation: conversationId
        })
        .sort({ createdAt: orderedBy == "desc" ? -1 : 1})
        .skip(start)
        .limit(end - start +1);

        orderedBy == 'desc' && conversationPart.reverse();


        return conversationPart?? `something went wrong while fetching messages from ${start} to ${end} . try another range`;

    } catch (err) {
        console.log(err);
        return error(err);
    }
}

export const getConversationLength = async (conversationId: string | object) => {
    try {
        const lenght = await Message.countDocuments({ $or: [
            { conversation: conversationId },
        ] })

        return lenght;

    } catch (err) {
        return error('something went wrong while getting the index of the message in the conversation !')
    }
}