import { ConnectionManager } from './ConnectionManager';
import { Room } from './Room';
import logger from './utils/logger';

export class ChatangoBot {

    private groups: string[];
    private username: string;
    private password: string;

    public connectionManager: ConnectionManager;

    constructor(groups: string[], username: string, password: string) {
        this.groups = groups;
        this.username = username;
        this.password = password;

        this.connectionManager = new ConnectionManager();
    }

    async connect() {
        // Connect to Chatango
        for (const group of this.groups) {
            const room = new Room(group, this);

            logger.info(`Connecting to ${group}...`);
            room.connect(this.username, this.password);
        }
    }

}