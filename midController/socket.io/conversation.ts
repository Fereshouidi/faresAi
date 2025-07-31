import express from "express";
import Conversation from "../../models/conversation.js";
import { createConversation, getConversationLength, getConversationSlice } from "../../controller/socket/conversation.js";
import { ConversationParams } from "../../types.js";


// export const createConversation_ = async (
//     // @ts-ignore
//     req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//     // @ts-ignore 
//     res: Response<any, Record<string, any>, number>
// ) => {

//     const {userId} = req.body;

//     try {
//         if (!userId) {
//             res.status(404).json({error: 'userId is not found !'})
//         }

//         const conversation = await createConversation(userId);

//         res.status(200).json({conversation});

//     } catch (err) {
//         res.status(500).json({error: err});
//     }


// }

export const getConversationsByUserId_ = async (
    // @ts-ignore
    socket: Socket,
    userId: string,
) => {

    try {
        if (!userId) {
            return socket.emit('get-conversations-response', {error: 'userId is required !'})
        }

        let conversations = await Conversation.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean() as ConversationParams[];

        const updatedConversations = await Promise.all(
            conversations.map(async (conversation) => {
                const length = await getConversationLength(conversation._id) as number;
                return { ...conversation, length } as ConversationParams;
            })
        );

        conversations = updatedConversations;

        console.log({conversations});

        return socket.emit('get-conversations-response', {conversations})

    } catch (err) {
        return socket.emit('get-conversations-response', {error: err})
    }


}

export const getConversationSlice_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { conversationId, skip } = req.query;

    try {

        const skip_ = Number(skip);

        if (!conversationId || typeof skip_ != 'number') {
            return res.status(404).json({error: 'userId and conversationId is required !'});
        }

        const slice = await getConversationSlice(conversationId, skip_, skip_ + 20, 'desc');

        console.log({slice});
        

        res.status(200).json({
            slice, 
            skip: skip_ + 20
        });

    } catch (err) {
        res.status(500).json({error: err});
    }


}



