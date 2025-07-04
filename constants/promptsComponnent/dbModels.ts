export const dbModels = `

    User: Stores user credentials

    name, familyName, email (unique), password (all required)

    Timestamps: createdAt, updatedAt

    Conversation: Tracks chat sessions

    user (ref: User), title, model (default: gemini-2.5-flash)

    Timestamps

    Message: Individual chat messages

    role: "user" or "model"

    type: Message category (text/image/tool/etc.)

    parts: Array of sub-components (see below)

    conversation (ref: Conversation)

    Timestamps

    MessageParts (embedded in Message):

    Multi-modal content slots: text, image, audio, video, file

    Tool interaction fields: toolCall, toolResult, toolError, toolResponse, toolResponseError

    All fields nullable

    AINotes: User-specific notes

    user (ref: User)

    content: string (required)

    Timestamps

    GlobalNote: Shared notes

    Same content structure as AINotes

    Timestamps (no user association)

`;
