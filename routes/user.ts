import express from "express";
import { createUser } from "../controller/user.js";
import { UserParams } from "../types.js";

const router = express.Router();

router.post("/createUser", async (req, res) => {

    const {name, familyName, email, password} = req.body as unknown as UserParams;

    try {
        if (!name || !familyName || !email || !password) {
            res.status(404).json({error: 'All fields are required !'})
        }

        const newUser = await createUser({
            name,
            familyName,
            email,
            password
        });

        res.status(200).json({newUser});

    } catch (err) {
        res.status(500).json({error: err});
    }


})



export default router;

