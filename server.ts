import express from 'express';
import mongoConn from './connection.js';
import { MessageParams } from './types.js';
import MessageRoute from './routes/messages.js'; 
import ConversationRoute from './routes/conversation.js';
import UserRoute from './routes/user.js';
import { primaryPrompt } from './constants/prompts.js';
import dotenv from "dotenv";
import { Server } from 'socket.io';
import cors from 'cors';
import registerSocketHandlers from './sockets/server.js';
import { Express } from 'express-serve-static-core';
import serverless from 'serverless-http';

console.log(1);


// dotenv.config();
// const io = new Server(Number(process.env.PORT));

console.log(2);

const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Server is working!");
});

// app.use('/api', MessageRoute);
// app.use('/api', ConversationRoute);
// app.use('/api', UserRoute);

console.log(3);


const port = 3002 || process.env.PORT;

console.log(process.env.PORT);


// await mongoConn;


// registerSocketHandlers(io);

console.log({primaryPrompt: primaryPrompt.length});

console.log(4);


const handler = serverless(app);

console.log(5);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

console.log(6);

export default handler;
