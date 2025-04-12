import { Font } from "../models/Font";
import { Message } from "../models/Message";
import { RGBColor } from "../models/RGBColor";
import { User } from "../models/User";
import type { Room } from "../Room";
import { BaseMessage } from "./Message";

const FONT_PATTERN: RegExp = /<f x(\d+)>/;
const ID_PATTERN: RegExp = /<n(\d+)>/;


// src/messages/ChatMessage.ts
export class ChatMessage extends BaseMessage {
    readonly type = 'b';
    private _room: Room;

    public text: string = ''
    public font: Font | null = null;
    public user: User | null = null;
    public ipAddress: string | null = '';

    constructor(room: Room) {
        super();
        this._room = room;
    }

    private parseUser(name: string) {
        const user = this._room.getUser(name);
        return user == null ? new User("UNKNOWN", name) : user;
    }

    parseArgs(args: string[]) {
        // Build raw message
        const rawMessage = args.slice(9).join(':');

        // Extract name and patterns
        let name = args[1];
        const fontMatch = FONT_PATTERN.exec(rawMessage);
        const idMatch = ID_PATTERN.exec(rawMessage);

        const font = fontMatch ? fontMatch[1].trim() : '';
        const nTag = idMatch ? idMatch[1].trim() : '';

        // Handle anonymous names
        if (!name) {
            name = `#${args[2]}`;
            if (name === '#') {
                name = `!anon${nTag}`;
            }
        }

        // Create user
        const user = this.parseUser(name);
        user.uid = args[3];
        if (user.sessionId !== 'UNKNOWN') {
            user.nameColor = new RGBColor(nTag);
        }

        // Clean message text
        const text = rawMessage
            .replace(/<.*?>/g, '')
            .replace(/&lt/g, '<')
            .replace(/&gt/g, '>')
            .replace(/&quot/g, '"')
            .replace(/&apos/g, "'")
            .replace(/&amp/g, '&')
            .replace(/<;/g, '<')
            .replace(/>;/g, '>');

        // Create message
        this.text = text;
        this.font = Font.parseFont(font);
        this.user = user;
        this.ipAddress = args[6];

        return this;
    }

}