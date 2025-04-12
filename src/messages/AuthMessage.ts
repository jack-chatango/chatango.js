import { SendableBaseMessage } from "./Message";

// src/messages/AuthMessage.ts
export class AuthMessage extends SendableBaseMessage {
    readonly type = 'bauth';
    
    constructor(
        private roomName: string,
        private uid: string,
        private username: string,
        private password: string
    ) {
        super();
    }

    parseArgs(args: string[]): void {
        // Not needed for outgoing-only messages
        throw new Error('AuthMessage is send-only');
    }

    serialize(): string {
        return this.serializeWithArgs(
            this.roomName,
            this.uid, 
            this.username,
            this.password
        );
    }
}