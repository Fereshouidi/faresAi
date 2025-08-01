import mongoose from 'mongoose';
import dotenv from "dotenv";


// dotenv.config();

    // process.env.MONGODB_URI ?

const mongoConn = mongoose.connect("mongodb+srv://feres997:feres997@cluster0.peiowiq.mongodb.net/faresAi")
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        })

    // : console.error('error : process.env.MONGODB_URI is undefined !')

export default mongoConn;