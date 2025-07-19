import test from "node:test";
import { createNote, getNoteByUserId, updateNoteById } from "./aiNote.js";
import { getConversationSlice } from "./conversation.js";
import { getMessagesByContent } from "./message.js";

let precedureResult = '<precedureResult></precedureResult>';

const setPrecedureResult = (res: string) => {
    const end = precedureResult.indexOf('</precedureResult>');
    precedureResult = precedureResult.slice(0, end) + res + precedureResult.slice(end);
}

const hasExtraTagInsideMessageToUser = (text: string, openTag: string, closeTag: string) => {

    const openIndex = text.indexOf(openTag);
    const closeIndex = text.indexOf(closeTag);

    const before = text.slice(0, openIndex);
    const after = text.slice(closeIndex + closeTag.length);

    return before.includes("<") || after.includes("<");

}

const hasPlainTextOutsideMessageToUser = (text: string, openTag: string, closeTag: string): boolean => {

  const openIndex = text.indexOf(openTag);
  const closeIndex = text.indexOf(closeTag);

  if (openIndex === -1 || closeIndex === -1) {
    return true;
  }

  const before = text.slice(0, openIndex).trim();
  const after = text.slice(closeIndex + closeTag.length).trim();

  return (before.replace(/<[^>]*>/g, "").trim().length > 0) ||
         (after.replace(/<[^>]*>/g, "").trim().length > 0);
}


export const checkSymbols = async (response: string) => { console.log({response});

    precedureResult = '<precedureResult></precedureResult>';

    if (!response.includes('<')) {
        setPrecedureResult(`<messageFromSystem> this message won't send to the user ! you should use the functional symbols to talk to user ! </messageFromSystem>`);
        return precedureResult;
    }
        
    if (response.includes('<messageToUser>')) {

        const hasExtraTag = hasExtraTagInsideMessageToUser(response, '<messageToUser>', '</messageToUser>');
        if (hasExtraTag) {
            setPrecedureResult(`<messageFromSystem> you can not use another tag with <messageToUser> ! Instead use only the other tag to get the result of it, then use <messageToUser> and tell the user about the result you got . </messageFromSystem>`);
            return precedureResult;
        }

        // const hasTextOutside = hasPlainTextOutsideMessageToUser(response, '<messageToUser>', '</messageToUser>');
        // if (hasTextOutside) {
        //     setPrecedureResult(`<error> you can not whrite any thing outside the tag because it won't send to user ! </error>`);
        //     console.log({hasTextOutside: precedureResult});
            
        //     return precedureResult;
        // }
        
        // const start = response.indexOf('<messageToUser>') + '<messageToUser>'.length;
        // const end = response.indexOf('</messageToUser>');
        // return response.slice(start, end).trim();
        return response;
    }

    if (response.includes('<tellUserToWait>')) {

        const hasExtraTag = hasExtraTagInsideMessageToUser(response, '<tellUserToWait>', '</tellUserToWait>');
        if (hasExtraTag) {
            setPrecedureResult(`<messageFromSystem> you can not use another tag with <tellUserToWait> ! Instead use only the other tag to get the result of it, then use <tellUserToWait> and tell the user about the result you got . </messageFromSystem>`);
            return precedureResult;
        }

        return response;
    }

    if (response.includes('<getNoteByUser>')) {
        const start = response.indexOf('<messageToUser>') + '<messageToUser>'.length;
        const end = response.indexOf('</messageToUser>');
        const userId = response.slice(start, end).trim();
        const res = await getNoteByUserId(userId);
        setPrecedureResult('<getNoteByUser>' + res + '<getNoteByUser/>');
    }

    if (response.includes('<createNote>')) {
        const start = response.indexOf('<createNote>') + '<createNote>'.length;
        const end = response.indexOf('</createNote>');
        const symboles = response.slice(start, end).trim();

        const userIdStart = symboles.indexOf('<userId>') + '<userId>'.length;
        const userIdEnd = symboles.indexOf('</userId>');

        const contentStart = symboles.indexOf('<content>') + '<content>'.length;
        const contentEnd = symboles.indexOf('</content>');

        const userId = symboles.slice(userIdStart, userIdEnd) as string;
        const content = symboles.slice(contentStart, contentEnd) as string;

        const res = await createNote(userId, content);
        setPrecedureResult('<createNote>' + res + '<createNote/>');

        // try {

        //     // const content = JSON.parse(symboles.slice(contentStart, contentEnd));
        //     const res = await createNote(userId, content);
        //     setPrecedureResult('<createNote>' + res.toString() + '<createNote/>');

        // } catch (err) {
        //     setPrecedureResult('<createNote>' + err + '<createNote/>');
        // }
        
        
    }

    if (response.includes('<updateNoteById>')) {
        
        const start = response.indexOf('<updateNoteById>') + '<updateNoteById>'.length;
        const end = response.indexOf('</updateNoteById>');
        const symboles = response.slice(start, end).trim();

        const idStart = symboles.indexOf('<id>') + '<id>'.length;
        const idEnd = symboles.indexOf('</id>');

        const dataStart = symboles.indexOf('<data>') + '<data>'.length;
        const dataEnd = symboles.indexOf('</data>');

        const id = symboles.slice(idStart, idEnd) as string;
        const data = symboles.slice(dataStart, dataEnd);
        
        const res = await updateNoteById(id, data);

        setPrecedureResult('<updateNoteById>' + res + '<updateNoteById/>');

    }

    if (response.includes('<getMessagesByRange>')) {
        
        const start = response.indexOf('<getMessagesByRange>') + '<getMessagesByRange>'.length;
        const end = response.indexOf('</getMessagesByRange>');
        const symboles = response.slice(start, end).trim();

        const conversationIdStart = symboles.indexOf('<conversationId>') + '<conversationId>'.length;
        const conversationIdEnd = symboles.indexOf('</conversationId>');

        const startFetchingStart = symboles.indexOf('<start>') + '<start>'.length;
        const startFetchingEnd = symboles.indexOf('</start>');

        const endFetchingStart = symboles.indexOf('<end>') + '<end>'.length;
        const endFetchingEnd = symboles.indexOf('</end>');

        const id = symboles.slice(conversationIdStart, conversationIdEnd) as string;
        const startFerching = Number(symboles.slice(startFetchingStart, startFetchingEnd));
        const endFetching = Number(symboles.slice(endFetchingStart, endFetchingEnd));

        const res = await getConversationSlice(id, startFerching, endFetching);
        setPrecedureResult('<getMessagesByRange>' + res + '<getMessagesByRange/>');
        
        // console.log({res});
        // console.log(startFerching, endFetching);
        

    }

    if (response.includes('<getMessagesByContent>')) {

        const start = response.indexOf('<getMessagesByContent>') + '<getMessagesByContent>'.length;
        const end = response.indexOf('</getMessagesByContent>');
        const symboles = response.slice(start, end).trim();

        const conversationIdStart = symboles.indexOf('<conversationId>') + '<conversationId>'.length;
        const conversationIdEnd = symboles.indexOf('</conversationId>');

        const contentStart = symboles.indexOf('<content>') + '<content>'.length;
        const contentEnd = symboles.indexOf('</content>');

        const conversationId = symboles.slice(conversationIdStart, conversationIdEnd) as string;
        const content = symboles.slice(contentStart, contentEnd);

        const res = await getMessagesByContent(conversationId, content);
        setPrecedureResult('<getMessagesByContent>' + res + '<getMessagesByContent/>');

    }
    console.log({precedureResult});
    
    
    return precedureResult;

}