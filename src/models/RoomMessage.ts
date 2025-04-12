import type { Room } from "../Room";

export class RoomMessage {

    constructor(
        public Room: Room, 
        public Time: number, 
        public puid: string,
        public Id: string,
        public unid: string,
        public Ip: string,
        public Raw: string,
        public Body: string
    ) {}
}