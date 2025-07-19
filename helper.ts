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