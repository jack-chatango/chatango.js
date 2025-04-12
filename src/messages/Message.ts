
/** Base message interface that all message types must implement */
export interface Message {
    /** The type identifier for this message (e.g. 'b' for chat messages) */
    readonly type: string;
    
    /** Parse the raw message arguments into this message type */
    parseArgs(args: string[]): void;
}

/** Interface for messages that can be sent */
export interface SendableMessage extends Message {
    /** Serialize this message for sending */
    serialize(): string;
}

/** Base class for implementing messages */
export abstract class BaseMessage implements Message {
    abstract readonly type: string;

    abstract parseArgs(args: string[]): void;
    
    /** Helper method to parse a raw message string */
    static parse(raw: string): {type: string, args: string[]} {
        const [type, ...args] = raw.split(':');
        return { type, args };
    }
}

/** Base class for messages that can be sent */
export abstract class SendableBaseMessage extends BaseMessage implements SendableMessage {
    abstract serialize(): string;

    /** Helper to format message for sending */
    protected serializeWithArgs(...args: string[]): string {
        return `${this.type}:${args.join(':')}\r\n\0`;
    }
}