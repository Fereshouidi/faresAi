import AINote from "../models/aiNote.js";
import { AiNoteParams, NoteContentParams } from "../types.js";


export const createNote = async (userId: string | object, content: string) => {

    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const newNote = new AINote({
            user: userId,
            content
        });

        await newNote.save();
        return newNote;

    } catch (error) {
        console.error("Error creating note:", error);
        throw new Error("Failed to create note");
    }
};

export const getNoteByUserId = async (userId: string | Object) => {
    if (!userId) {
        console.error("User ID is required");
        return new Error("User ID is required");
    }

    try {
        const notes = await AINote.findOne({ user: userId });
        return notes?? `User with id "${userId}" does not have a note.`;
    } catch (error) {
        console.error("Failed to fetch notes");
        return new Error("Failed to fetch notes");
    }
};

export const addNote = async (noteId: string | Object, { title, text }: NoteContentParams) => {
    if (!title || !text) {
        console.error("Title and text are required");
        return new Error("Title and text are required");
    }

    try {
        const updatedNote = await AINote.updateOne(
            { _id: noteId },
            { $push: { content: { title, text } }},
            { new: true }
        );

        return updatedNote;

    } catch (error) {
        console.error("Error adding note:", error);
        throw new Error("Failed to add note");
    }
};

export const updateNoteById = async (id: string | Object, content: string) => {

    if (!id) {
        console.error("ID is required" );
        return new Error("ID is required");
    }

    try {
        const updatedNote = await AINote.findOneAndUpdate(
            { _id: id },
            { 
                content, 
                updatedAt: new Date() 
            },
            { new: true }
        );
        return updatedNote?? `"something went wrong while updating this note with id = ${id}"`;

    } catch (error) {
        console.error("Failed to update note" + error);
        return new Error("Failed to update note" + error);
    }
};
