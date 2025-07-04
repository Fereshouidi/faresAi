import express from 'express';
import mongoConn from './connection.js';
// import cors from 'cors';
import { createDefaultMessages, getTextAnswer, updatePrimaryPrompt } from './controller/message.js';
import { MessageParams } from './types.js';
import MessageRoute from './routes/messages.js'; 
import ConversationRoute from './routes/conversation.js';
import UserRoute from './routes/user.js';
import { primaryPrompt } from './constants/prompts.js';
import dotenv from "dotenv";


dotenv.config();


const app = express();
// app.use(cors());
app.use(express.json());

app.use('/api', MessageRoute);
app.use('/api', ConversationRoute);
app.use('/api', UserRoute);

const port = process.env.PORT;

await mongoConn;
// await createDefaultMessages();

// console.log(await updatePrimaryPrompt(primaryPrompt));
 


// import OpenAI from 'openai';
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: "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",
// });
// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "mistralai/mistral-small-3.2-24b-instruct",
//     messages: [
//       {
//         "role": "user",
//         "content": primaryPrompt + 'i will repeat the constructions again :' + primaryPrompt + 'and one more time :' + primaryPrompt + 'and one more time :' + primaryPrompt + 'and one more time :' + primaryPrompt
//       },
//       {
//         "role": "assistant",
//         "content": 'ok, i am reday'
//       },
//       {
//         "role": "user",
//         "content": 'hi'
//       }
//     ],
    
//   });

//   console.log(completion.choices[0].message.content);
// }

// main();



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});