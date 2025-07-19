// import express from "express";
// import { createConversation, getConversationSlice } from "../../controller/conversation.js";
// import Conversation from "../../models/conversation.js";


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

// export const getConversationsByUserId_ = async (
//     // @ts-ignore
//     req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//     // @ts-ignore 
//     res: Response<any, Record<string, any>, number>
// ) => {

//     const { userId } = req.query;

//     try {
//         if (!userId) {
//             return res.status(404).json({error: 'userId is required !'})
//         }

//         const conversations = await Conversation.find({user: userId})
//         .sort({ createdAt: -1 })

//         res.status(200).json({conversations});

//     } catch (err) {
//         res.status(500).json({error: err});
//     }


// }

// export const getConversationSlice_ = async (
//     // @ts-ignore
//     req: Request<{}, any, any, ParsedQs, Record<string, any>>,
//     // @ts-ignore 
//     res: Response<any, Record<string, any>, number>
// ) => {

//     const { conversationId, skip } = req.query;

//     try {

//         const skip_ = Number(skip);

//         if (!conversationId || typeof skip_ != 'number') {
//             return res.status(404).json({error: 'userId and conversationId is required !'});
//         }

//         const slice = await getConversationSlice(conversationId, skip_, skip_ + 20, 'desc');

//         console.log({slice});
        

//         res.status(200).json({
//             slice, 
//             skip: skip_ + 20
//         });

//     } catch (err) {
//         res.status(500).json({error: err});
//     }


// }



