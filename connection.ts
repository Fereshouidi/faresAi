import mongoose from 'mongoose';
import dotenv from "dotenv";


dotenv.config();

// if (!process.env.MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }


const mongoConn = 

    process.env.MONGODB_URI ?

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        })

    : console.error('error : process.env.MONGODB_URI is undefined !')

export default mongoConn;