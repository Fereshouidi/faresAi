import { createNote, getNoteByUserId, updateNoteById } from "../../controller/socket/aiNote.js";
import { getConversationSlice, updateConversationById } from "../../controller/socket/conversation.js";
import { createMessage, getMessagesByContent } from "../../controller/socket/message.js";
import { Socket } from "socket.io";

let result = '<Restult></Result>';
let precedureResult = '<precedureResult></precedureResult>';

const setPrecedureResult = (res: string) => {
    const end = precedureResult.indexOf('</precedureResult>');
    precedureResult = precedureResult.slice(0, end) + res + precedureResult.slice(end);
}

const setResult = (res: string) => {
    const end = result.indexOf('</Result>');
    result = result.slice(0, end) + res + result.slice(end);
}

export async function checkSymbols (response: string) { console.log({response});

    precedureResult = '<precedureResult></precedureResult>';
    result = '<Restult></Result>';

    if (!response.includes('<')) {
        setResult(`<messageFromSystem> this message won't send to the user ! you should use the functional symbols to talk to user ! </messageFromSystem>`);
        return precedureResult;
    }
        
    if (response.includes('<messageToUser>')) {

        const start = response.indexOf('<messageToUser>') + '<messageToUser>'.length;
        const end = response.indexOf('</messageToUser>');
        const content = response.slice(start, end).trim();

        setResult('<messageToUser>' + content + '</messageToUser>');        
    }

    if (response.includes('<tellUserToWait>')) {

        const start = response.indexOf('<tellUserToWait>') + '<tellUserToWait>'.length;
        const end = response.indexOf('</tellUserToWait>');
        const content = response.slice(start, end).trim();
        
        setResult('<tellUserToWait>' + content + '</tellUserToWait>');
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

        setPrecedureResult('<updateNoteById>' + res.message + '<updateNoteById/>');

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

    if (response.includes('<updateConversationById>')) {
    
        const start = response.indexOf('<updateConversationById>') + '<updateConversationById>'.length;
        const end = response.indexOf('</updateConversationById>');
        const symboles = response.slice(start, end).trim();

        const idStart = symboles.indexOf('<id>') + '<id>'.length;
        const idEnd = symboles.indexOf('</id>');

        const dataStart = symboles.indexOf('<data>') + '<data>'.length;
        const dataEnd = symboles.indexOf('</data>');

        const id = symboles.slice(idStart, idEnd) as string;
        const data = symboles.slice(dataStart, dataEnd);

        try {
            const updatedData = JSON.parse(data);
            const res = await updateConversationById(id, updatedData);
            setPrecedureResult('<updateConversationById>' + res?.message + '</updateConversationById>');
            socket.emit('update-conversation', {updatedConversation: res?.conversation});
        } catch (err) {
            console.log({data});
            
            console.error('Error parsing data:', err);
            setPrecedureResult('<updateConversationById>Error parsing data: ' + err + '</updateConversationById>');
        }

    }
    
    if (precedureResult != "<precedureResult></precedureResult>") {
        setResult(precedureResult);
    }

    console.log({result});
    
    return result;
    // return precedureResult == "<precedureResult></precedureResult>" ? null : precedureResult;

}