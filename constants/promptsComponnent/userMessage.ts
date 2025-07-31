import { error } from "console";
import { getNoteByUserId } from "../../controller/endpoint/aiNote.js";
import { getConversationLength } from "../../controller/endpoint/conversation.js";
import { AiNoteParams, ConversationParams, NoteContentParams, UserParams } from "../../types.js";
import { ObjectId } from "mongoose";
import { getUserById } from "../../controller/socket/user.js";


export const custimizeUserMessage = async (conversation: ConversationParams, user: UserParams, summarizedConversation: string, message: string, isWaiting: boolean) => { 
    
    const messageIndex = await getConversationLength(conversation._id);

    return `

        بيانات المستخدم {
            ${user?? 'not exist'}
        }

        معرف المحادثة {
            ${conversation._id}
        }

        ملخص المحادثة {
            ${summarizedConversation}
        }

        رسالة المستخدم {
            <messageFromUser>${message}</messageFromUser>
        }

        رقم الرسالة {
            ${messageIndex}
        }
        دفتر الملاحظات العام {
            don't forget to use the functional Symbols to speak to the user
        }


        تاريخ ارسال الرسالة {
            ${new Date()}
        }

        


`
};

// export const parseCustomizedMessage = (input: string) => {
//     console.log("parseCustomizedMessage", input);
    
//   const extractBetween = (label: string, text: string) => {
//     const regex = new RegExp(`${label}\\s*{([\\s\\S]*?)}`, 'm');
//     const match = text.match(regex);
//     return match ? match[1].trim() : null;
//   };

//   const userId = extractBetween("معرف المستخدم", input);
//   const conversationId = extractBetween("معرف المحادثة", input);
//   const userMessage = extractBetween("رسالة المستخدم", input);
//   const isWaitingBlock = extractBetween("ملاحظات حول المستخدم", input);
//   const aiNote = extractBetween("دفتر الملاحظات الخاص بالمستخدم", input);
//   const conversationLength = extractBetween("مكان الرسالة داخل المحادثة", input);
//   const dateString = extractBetween("تاريخ ارسال الرسالة", input);

//   const isWaiting = isWaitingBlock?.includes("true");

//   return {
//     userId,
//     conversationId,
//     message: userMessage?.replace(/<\/?messageFromUser>/g, '').trim(),
//     isWaiting,
//     aiNote,
//     conversationLength,
//     date: dateString ? new Date(dateString) : null
//   };
// };

