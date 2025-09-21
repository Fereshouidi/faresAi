import express from "express";
import { createConversation, editConversation, getConversationSlice } from "../../controller/endpoint/conversation.js";
import Conversation from "../../models/conversation.js";
import { deleteconversation } from "../../controller/socket/conversation.js";
import { ResultParams } from "../../types.js";


export const createConversation_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const {userId} = req.body;

    try {
        if (!userId) {
            res.status(404).json({error: 'userId is not found !'})
        }

        const conversation = await createConversation(userId);

        res.status(200).json({conversation});

    } catch (err) {
        res.status(500).json({error: err});
    }


}

export const getConversationsByUserId_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { userId } = req.query;

    try {
        if (!userId) {
            return res.status(404).json({error: 'userId is required !'})
        }

        const conversations = await Conversation.find({user: userId})
        .sort({ createdAt: -1 })
        .lean()

        res.status(200).json({conversations});

    } catch (err) {
        res.status(500).json({error: err});
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

        res.status(200).json({
            slice, 
            skip: skip_ + 20
        });

    } catch (err) {
        res.status(500).json({error: err});
    }


}

export const deleteconversation_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { conversationId } = req.query;

    try {

        if (!conversationId) {
            return res.status(404).json({error: 'conversationId is required !'});
        }

        const result = await deleteconversation(conversationId);
        
        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({error: err});
    }


}

export const editConversation_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { updatedData } = req.body;

    console.log({updatedData});
    

    try {

        if (!updatedData) {
            return res.status(404).json({error: 'updatedData is required !'});
        }

        const result = await editConversation(updatedData) as ResultParams;

        if (result?.status == 404) {
            console.error("error : " + result.message);
            return res.status(404).json({error: result.message});
        }

        if (result?.status == 500) {
            console.error("error : " + result.message);
            return res.status(500).json({error: result.message});
        }
        
        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({error: err});
    }


}

