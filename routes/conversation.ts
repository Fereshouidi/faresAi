import express from "express";
import { createConversation } from "../controller/conversation.js";

const router = express.Router();

router.post("/createConversation", async (req, res) => {

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


})



export default router;

