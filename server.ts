import express from 'express';
import mongoConn from './connection.js';
// import cors from 'cors';
// import { createDefaultMessages, updatePrimaryPrompt } from './controller/endpoint/message.js';
import { MessageParams } from './types.js';
import MessageRoute from './routes/messages.js'; 
import ConversationRoute from './routes/conversation.js';
import UserRoute from './routes/user.js';
import { primaryPrompt } from './constants/prompts.js';
import dotenv from "dotenv";
import { Server } from 'socket.io';
// import io from './socket.io.js';
import registerSocketHandlers from './sockets/server.js';
// import { custimizeUserMessage, parseCustomizedMessage } from './constants/promptsComponnent/userMessage.js';

dotenv.config();
const io = new Server(3000)

const app = express();
// app.use(cors());
app.use(express.json());

app.use('/api', MessageRoute);
app.use('/api', ConversationRoute);
app.use('/api', UserRoute);


const port = process.env.PORT;

await mongoConn;


registerSocketHandlers(io);

console.log({primaryPrompt: primaryPrompt.length});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});