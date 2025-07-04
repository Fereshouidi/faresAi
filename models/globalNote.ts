import mongoose from "mongoose";

const globalNoteSchema = new mongoose.Schema({
    content: {
        type: [{
            title: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
        }],
        required: true,
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

const GlobalNote = mongoose.model("GlobalNote", globalNoteSchema);
export default GlobalNote;
