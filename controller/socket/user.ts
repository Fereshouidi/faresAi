import { error } from "console";
import User from "../../models/user.js";
import { UserParams } from "../../types.js";
import Conversation from "../../models/conversation.js";
import { createNote } from "./aiNote.js";
import { ObjectId } from "mongoose";

export const getUserById = async (id: string) => {
    if (!id) {
        return error('ID is required');
    }

    try {
        const user = await User.findOne({_id: id});
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

export const getUserBySignIn = async (email: string, password: string) => {

    console.log({email, password});
    

    try {
        if (!email || !password) {
            return {error: 'email and password are required !'}
        }

        const user = await User.findOne({email, password});

        return user;

    } catch (err) {
        return err;
    }
}

export const getUserByConversation = async (conversationId: string) => {
    if (!conversationId) {
        return error('conversationId is required');
    }

    try {
        const conversation = await Conversation.findOne({_id: conversationId}).lean();
        const user = await User.findOne({_id: conversation?.user})
        
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
}

export const createUser = async ({name, familyName, email, password}: UserParams) => {

    if (!name || !familyName || !email || !password) {
        return error('All fields are required');
    }

    try {
        const newUser = await new User({
            name,
            familyName,
            email,
            password
        }).save();

        await createNote(newUser._id, 'empty')

        if (newUser) {
            return newUser
        } else {
            return null;
        }

    } catch (err) {
        throw err;
    }
}

export const updateUser = async (updatedData: UserParams) => {

    if (!updatedData) {
        return error('All fields are required');
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(updatedData._id, updatedData, { new: true });
        return updatedUser;
    } catch (err) {
        throw err;
    }

}

export const updateNotes = async (userId: string | ObjectId , updatedNotes: String) => {

    if (!updatedNotes) {
        return error('updatedNotes is required');
    }

    try {

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedNotes, 
            { new: true }
        );

        return {
            message: "notes has been updated successfully",
            updatedUser
        };

    } catch (err) {
        throw err;
    }

}