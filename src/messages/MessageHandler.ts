// src/messages/MessageHandler.ts
import { BaseMessage, type Message } from './Message';
import { AuthMessage } from './AuthMessage';
import { ChatMessage } from './ChatMessage';
import type { Room } from '../Room';

export class MessageHandler {
    private messageTypes = new Map<string, new (...args: any[]) => Message>([
        ['b', ChatMessage],
        ['bauth', AuthMessage],
        // Add other message types here
    ]);

    constructor(private room: Room) {}

    handleMessage(raw: string): Message | null {
        const {type, args} = BaseMessage.parse(raw);
        
        const MessageClass = this.messageTypes.get(type);
        if (!MessageClass) {
            return null;
        }

        const message = type === 'b' 
            ? new ChatMessage(this.room)
            : new MessageClass();

        message.parseArgs(args);
        return message;
    }
}