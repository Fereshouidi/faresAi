import express from "express";
import { UserParams } from "../types.js";
import User from "../models/user.js";
import { createUser_, getUserBySignIn_, getUserByToken_ } from "../midController/endPoint/user.js";

const router = express.Router();

router.post("/createUser", async (req, res) => {
    createUser_(req, res)
})

// @ts-ignore
router.get("/getUserBySignIn", async (req, res) => {
    getUserBySignIn_(req, res);
})

// @ts-ignore
router.get("/getUserByToken", async (req, res) => {
    getUserByToken_(req, res);
})


export default router;

