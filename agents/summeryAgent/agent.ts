import { GoogleGenAI } from "@google/genai";
import { ConversationParams, MessageParams, UserParams } from "../../types.js";
import Conversation from "../../models/conversation.js";
import User from "../../models/user.js";






export const createConversationTittle = async (firstMessage: string) => {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_KEY,
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

                    1. أول رسالة: "اهلا"
                    ✅ العنوان: محادثة ودية

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


export const summarizeConversation_updateNotes = async (conversation: ConversationParams, newMessages: MessageParams[], user?: UserParams ) => {

    console.log({conversation: conversation._id, newMessages});
    

    if (typeof conversation.summary === 'undefined') {
        return {
            updatedConversation: conversation,
            summary: undefined
        }; 
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_KEY,
    });
    

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
            {
                role: "user",
                parts: [{ text: `
                    ✅ أنت تعمل كمساعد داخل تطبيق ذكاء اصطناعي للدردشة، ومهمتك تلخيص المحادثات.
                    ✅ في كل مرة، ستتلقى ملخصًا سابقًا للمحادثة، بالإضافة إلى مجموعة من الرسائل الجديدة.
                    ✅ مهمتك هي تحديث الملخص الحالي بدمج الرسائل الجديدة بطريقة متماسكة ومنطقية.
                    ✅ يجب الحفاظ على المعلومات المهمة وعدم إهمال التفاصيل الجوهرية.
                    ✅ تأكد من ألا يتجاوز الملخص النهائي 1000 رمز (token).
                    ✅ إذا تجاوز هذا الحد، فابدأ تدريجيًا في حذف أو تبسيط التفاصيل الأقل أهمية مع الحفاظ على المعنى العام.
                    ✅ قم بكتابة ملخص المحادثة المحدث بهذه الطريقة <summary>ملخص المحادثة المحدث</summary>

                    🔹 بالإضافة إلى ذلك، ستتلقى ملاحظات تخص المستخدم، ومهمتك هي تحديث هذه الملاحظات بناءً على ما يمكن استخلاصه من الرسائل الجديدة.
                    🔹 الغرض من هذه الملاحظات هو مساعدة النموذج على تذكّر معلومات عن المستخدم حتى خارج سياق المحادثة الأصلية.
                    🔹 لا تدون كل شيء، فقط ما تراه يستحق التذكر ويُفيد في فهم المستخدم مستقبلاً.
                    🔹 يجب ألا تتجاوز الملاحظات 500 عنصر، وإذا احتجت لتدوين المزيد، فقم بمسح أو تبسيط الملاحظات الأقل أهمية.
                    ✅ قم بكتابة الملاحظات المحدثة بهذه الطريقة <notes>الملاحظات المحدثة</notes>
                    ` }],
            },
            {
                role: "model",
                parts: [{ text: "Great , let's get started!" }],
            },
        ],
    });

    const res = await chat.sendMessage({
        message: `
            the summarized conversation so far is "${conversation.summary}" 
            and the new messages to summarize are "${newMessages}"
            and the notes about the user is "${user?.notes}"
        `,
    });

    if (!res.text) {
        throw new Error('something went wrong while getting conversation summary and the updated notes about user from summeryAgent !')
    }

    const summaryStart = res.text.indexOf('<summary>') + '<summary>'.length;
    const summaryend = res.text.indexOf('</summary>')

    const notesStart = res.text.indexOf('<notes>') + '<notes>'.length;
    const notesend = res.text.indexOf('</notes>')

    const summary = res.text.slice(summaryStart, summaryend) as string;
    const notes = res.text.slice(notesStart, notesend) as string;

    const updatedConversation = summary && await Conversation.findOneAndUpdate(
        {_id: conversation._id},
        {summary},
        {new: true}
    )

    const updatedUser = notes && await User.findOneAndUpdate(
        {_id: user?._id},
        {notes},
        {new: true}
    )

    console.log({updatedConversation});

    return {
        updatedConversation,
        summary,
        notes

    };
}



`
    - تعديل الملاحظات حول المستخدم:
    <updateNoteById>
        <id>معرف المستخدم</id>
        <data> الملاحظات المحدثة</data>
    </updateNoteById>
`