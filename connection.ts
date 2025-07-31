import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoConn = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Error: process.env.MONGODB_URI is undefined!');
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

export default mongoConn;
