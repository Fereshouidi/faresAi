import express from "express";
import { UserParams } from "../../types.js";
import User from "../../models/user.js";
import { createUser } from "../../controller/endpoint/user.js";


export const createUser_ =  async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

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


}

export const getUserBySignIn_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { email, password } = req.query as unknown as UserParams;

    console.log({ email, password });
    
    try {
        if (!email || !password) {
            return res.status(404).json({error: 'email and password are required !'})
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({error: "account is not found !"});
        }

        if (user?.password != password) {
            return res.status(401).json({error: "password is wrong !"});
        }

        return res.status(200).json({user});

    } catch (err) {
        res.status(500).json({error: err});
    }


}

export const getUserByToken_ = async (
    // @ts-ignore
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    // @ts-ignore 
    res: Response<any, Record<string, any>, number>
) => {

    const { token } = req.query;
    
    try {
        if (!token) {
            return res.status(404).json({error: 'token is required !'})
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.status(404).json({error: "account is not found !"});
        }

        return res.status(200).json({user});

    } catch (err) {
        res.status(500).json({error: err});
    }


}

