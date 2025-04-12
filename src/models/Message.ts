import { Font } from './Font'
import { User } from './User';

export class Message {
    private readonly text: string;
    private _font: Font | null;
    private _user: User | null;
    private _ipAddress: string | null;

    constructor(message: string, font?: Font | null, user?: User | null) {
        this.text = message;
        this._font = font || null;
        this._user = user || null;
        this._ipAddress = null;
    }

    get messageText(): string {
        return this.text;
    }

    get font(): Font | null {
        return this._font;
    }

    set font(value: Font | null) {
        this._font = value;
    }

    get user(): User | null {
        return this._user;
    }

    set user(value: User | null) {
        this._user = value;
    }

    get ipAddress(): string | null {
        return this._ipAddress;
    }

    set ipAddress(value: string | null) {
        this._ipAddress = value;
    }
}