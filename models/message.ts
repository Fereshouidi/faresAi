import mongoose from "mongoose";

const messagePartsSchema = new mongoose.Schema({
    text: {
        type: String || null,
    },
    image: {
        type: String || null,
    },
    audio: {
        type: String || null,
    },
    video: {
        type: String || null,
    },
    file: {
        type: String || null,
    },
    toolCall: {
        type: Object || null,
    },
    toolResult: {
        type: Object || null,
    },
    toolError: {
        type: Object || null,
    },
    toolResponse: {
        type: Object || null,
    },
    toolResponseError: {
        type: Object || null,
    }
});

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "model"],
        required: true,
    },
    parts: {
        type: [messagePartsSchema],
        _id: false,
        required: true,
    },
    type: {
        type: String,
        enum: ["primaryPrompt", "primaryResponse", "text", "image", "audio", "video", "file", "toolCall", "toolResult", "toolError", "toolResponse", "toolResponseError"],
        required: true,
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
export { messagePartsSchema, messageSchema };