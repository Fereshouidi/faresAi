import { GoogleGenAI } from "@google/genai";
import { geminiKey } from "../constants/index.js";

export const getPureModelMessage = (message: string) => {

    const modelMessageStart = message.indexOf('<messageToUser>') + '<messageToUser>'.length;
    const modelMessageEnd = message.indexOf('</messageToUser>');
    const modelMessage =  message.slice(modelMessageStart, modelMessageEnd).trim();

    return modelMessage;

}

export const getPureUserMessage = (message: string) => {

    const userMessageStart = message.indexOf('<messageFromUser>') + '<messageFromUser>'.length;
    const userMessageEnd = message.indexOf('</messageFromUser>');
    const userMessage =  message.slice(userMessageStart, userMessageEnd).trim();

    return userMessage;

}

export const isOnlyTellUserToWaitTag = (text: string) => {
  const regex = /^<tellUserToWait>[\s\S]*<\/tellUserToWait>\s*$/;
  return regex.test(text);
};

export const createConversationTittle = async (firstMessage: string) => {

    const ai = new GoogleGenAI({
        apiKey: geminiKey,
    });
    

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
            {
                role: "user",
                parts: [{ text: `
                    أنت الآن تعمل كمولّد لعناوين المحادثات داخل تطبيق ذكاء اصطناعي.

                    🔹 مهمتك:
                    عندما أرسل لك أول رسالة في محادثة، يجب أن تنشئ عنوانًا مناسبًا يعبر عن محتوى هذه الرسالة.

                    🔸 التعليمات:
                    - يجب أن يحتوي ردك على العنوان فقط.
                    - لا تضف أي جملة إضافية، أو شرح، أو رموز، أو علامات ترقيم زائدة.
                    - اجعل العنوان قصيرًا وواضحًا.

                    🧪 أمثلة:

                    1. أول رسالة: "كيف أتعلم البرمجة من الصفر؟"  
                    ✅ العنوان: تعلم البرمجة

                    2. أول رسالة: "ما هي شروط الهجرة إلى كندا؟"  
                    ✅ العنوان: شروط الهجرة إلى كندا

                    3. أول رسالة: "لدي مشكلة في socket.io لا أستطيع استقبال الرسائل."  
                    ✅ العنوان: مشكلة في socket.io

                    4. أول رسالة: "أريد إنشاء موقع تواصل اجتماعي مثل فيسبوك."  
                    ✅ العنوان: إنشاء موقع تواصل اجتماعي

                    5. أول رسالة: "كيف أطبخ المعكرونة الإيطالية؟"  
                    ✅ العنوان: طبخ المعكرونة الإيطالية

                    ` }],
            },
            {
                role: "model",
                parts: [{ text: "Great , let's get started!" }],
            },
        ],
    });

    const title = await chat.sendMessage({
    message: `the first message is: ${firstMessage}`,
    });



    return title.text;
}