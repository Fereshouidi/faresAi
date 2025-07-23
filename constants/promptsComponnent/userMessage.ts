import { error } from "console";
import { getNoteByUserId } from "../../controller/endpoint/aiNote.js";
import { getConversationLength } from "../../controller/endpoint/conversation.js";
import { AiNoteParams, NoteContentParams } from "../../types.js";


export const custimizeUserMessage = async (userId: string | Object, conversationId: string, message: string, isWaiting: boolean) => { 

    const aiNote = await getNoteByUserId(userId) as AiNoteParams | string;

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

export const parseCustomizedMessage = (input: string) => {
    console.log("parseCustomizedMessage", input);
    
  const extractBetween = (label: string, text: string) => {
    const regex = new RegExp(`${label}\\s*{([\\s\\S]*?)}`, 'm');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const userId = extractBetween("معرف المستخدم", input);
  const conversationId = extractBetween("معرف المحادثة", input);
  const userMessage = extractBetween("رسالة المستخدم", input);
  const isWaitingBlock = extractBetween("ملاحظات حول المستخدم", input);
  const aiNote = extractBetween("دفتر الملاحظات الخاص بالمستخدم", input);
  const conversationLength = extractBetween("مكان الرسالة داخل المحادثة", input);
  const dateString = extractBetween("تاريخ ارسال الرسالة", input);

  const isWaiting = isWaitingBlock?.includes("true");

  return {
    userId,
    conversationId,
    message: userMessage?.replace(/<\/?messageFromUser>/g, '').trim(),
    isWaiting,
    aiNote,
    conversationLength,
    date: dateString ? new Date(dateString) : null
  };
};

