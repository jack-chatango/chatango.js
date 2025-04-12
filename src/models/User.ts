import type { RGBColor } from "./RGBColor";

export class User {
    name: string;
    uid: string;
    sessionId?: string;
    nameColor?: RGBColor;

    constructor(name: string, uid: string, sessionId?: string) {
        this.name = name;
        this.uid = uid;
        this.sessionId = sessionId;
    }
    
}
