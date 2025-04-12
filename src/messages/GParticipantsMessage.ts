import { SendableBaseMessage } from "./Message";

export class GParticipantsMessage extends SendableBaseMessage {
    readonly type = 'g_participants';
    
    constructor() {
        super();
    }

    parseArgs(args: string[]): void {
        // Not needed for outgoing-only messages
        throw new Error('AuthMessage is send-only');
    }

    serialize(): string {
        return this.serializeWithArgs("start");
    }
}