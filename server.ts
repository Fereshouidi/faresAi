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
import http from 'http';
import User from './models/user.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Server is working!");
  console.log("Server is working!");
  
});

app.get("/getAllUsers", async (req, res) => {
  const users = await User.find();
  res.send(users)
  
});

app.use('/routes', MessageRoute);
app.use('/routes', ConversationRoute);
app.use('/routes', UserRoute);

const port = process.env.PORT;

await mongoConn;


registerSocketHandlers(io);

console.log({primaryPrompt: primaryPrompt.length});

// const handler = serverless(app);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// export default handler;
