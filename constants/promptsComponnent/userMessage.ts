import { error } from "console";
import { getNoteByUserId } from "../../controller/aiNote.js";
import { getConversationLength } from "../../controller/conversation.js";
import { AiNoteParams, NoteContentParams } from "../../types.js";


export const custimizeUserMessage = async (userId: string | Object, conversationId: string, message: string, isWaiting: boolean) => { 

    // const globalNote = 
    const aiNote = await getNoteByUserId(userId) as AiNoteParams | string;
    // let aiNote = [] as unknown as NoteContentParams[] | string;

    // if (typeof aiNote_ == 'string' && typeof aiNote == 'string') {
    //     aiNote = aiNote_;
    // }

    // if (typeof aiNote_ != 'string' && typeof aiNote != 'string') {
    //     aiNote_.content.map(note => aiNote.push(note));
    // }

    return `

        معرف المستخدم {
            ${userId}
        }

        معرف المحادثة {
            ${conversationId}
        }

        رسالة المستخدم {
            <messageFromUser>${message}</messageFromUser>
        }
        
        ملاحظات حول المستخدم {
            - is user at the waithing position ? : ${isWaiting}
        }
        
        دفتر الملاحظات الخاص بالمستخدم {
            ${aiNote?? 'not exist'}
        }

        دفتر الملاحظات العام {
            don't forget to use the functional Symbols to speak to the user
        }

        مكان الرسالة داخل المحادثة  {
            ${await getConversationLength(conversationId)}
        }

        تاريخ ارسال الرسالة {
            ${new Date()}
        }

        


`};