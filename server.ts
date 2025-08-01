import express from 'express';
import mongoConn from './connection.js';
import { MessageParams } from './types.js';
import MessageRoute from './routes/messages.js'; 
import ConversationRoute from './routes/conversation.js';
import UserRoute from './routes/user.js';
import { primaryPrompt } from './constants/prompts.js';
import dotenv from "dotenv";
import { Server } from 'socket.io';
import registerSocketHandlers from './sockets/server.js';
import { Express } from 'express-serve-static-core';
import serverless from 'serverless-http';

dotenv.config();
const io = new Server(Number(process.env.PORT))

const app = express();
app.use(express.json());

app.use('/api', MessageRoute);
app.use('/api', ConversationRoute);
app.use('/api', UserRoute);


const port = process.env.PORT;

// await mongoConn;


registerSocketHandlers(io);

console.log({primaryPrompt: primaryPrompt.length});

app.get("/", (req, res) => {
  res.send("Server is working!");
});

const handler = serverless(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default handler;
