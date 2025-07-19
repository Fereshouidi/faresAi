import { randomBytes } from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    familyName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: () => randomBytes(16).toString('hex'),
        unique: true,
    },

}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
