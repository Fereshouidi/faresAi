import { error } from "console";
import Conversation from "../../models/conversation.js";
import Message from "../../models/message.js";
import { primaryPrompt } from "../../constants/prompts.js";
import { ConversationParams } from "../../types.js";

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
        const updatedConversation = await Conversation.findOneAndUpdate({_id: id}, updateData, {new: true}).lean();
        if (updatedConversation) {
            return updatedConversation;
        } else {
            return null;
        }
    } catch (err) {
        throw err;
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
        const lenght = await Message.countDocuments({ conversation: conversationId })

        return lenght;

    } catch (err) {
        return error('something went wrong while getting the index of the message in the conversation !')
    }
}

export const editConversation = async (updatedData: ConversationParams) => {
    try {
        const updatedConversation_ = await Conversation.findByIdAndUpdate(
            {_id: updatedData._id},
            updatedData,
            {new: true}
        );
        
        if (!updatedConversation_) {
            return {
                status: 404,
                message: `there is no conversation with id = ${updatedData._id}!`
            }
        }

        const updatedConversation = updatedConversation_.toObject();
        const length = await getConversationLength(updatedConversation._id)

        return {
            status: 201,
            message: 'conversation has been updated successfully',
            updatedConversation: {...updatedConversation, length}
        }
        
    } catch (err) {
        console.log({err});
        return err;
    }
}