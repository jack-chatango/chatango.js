import { WebSocket } from "ws";
import logger from "./utils/logger";

/**
 * Manages WebSocket connections and reconnection logic for chat groups
 */
export class ConnectionManager {

    private connections: Map<string, WebSocket>;
    private reconnectAttempts: Map<string, number>;
    private maxReconnectAttempts = 5;

    // Websocket messages that should be sent immediately after connection is established
    // i.e. authentication messages or initialization messages for groups
    private initMessages: Map<string, string> = new Map();
    
    constructor() {
        this.connections = new Map();
        this.reconnectAttempts = new Map();
    }

    async createConnection(group: string, url: string): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            try {
                logger.debug(`Creating connection for ${group} at ${url}`);
                const ws = new WebSocket(url, {
                    headers: {
                        origin: 'https://st.chatango.com'
                    },
                    // Extended timeout to prevent premature connection closure
                    timeout: 99999999
                });

                ws.addEventListener('open', () => {
                    logger.debug("Connection established for", group);
                    this.connections.set(group, ws);
                    this.reconnectAttempts.set(group, 0);
                    resolve(ws);

                    const initMessage = this.initMessages.get(group);
                    if (initMessage) {
                        ws.send(initMessage);
                    }
                });

                ws.addEventListener('close', ev => {
                    logger.info("Socket closed due to", ev.type);
                    this.handleDisconnect(group, url)
                });

                ws.addEventListener('error', (error) => {
                    logger.error(`WebSocket error for ${group}:`, error);
                    reject(error);
                });
            } catch (error) {
                logger.error(`Failed to create connection for ${group}:`, error);
                reject(error);
            }
        });
    }

    async sendMessage(roomName: string, message: string) {

        const connection = this.getConnection(roomName);

        if (!connection) {
            logger.error(`No connection found for ${roomName}`);
            return;
        }

        logger.debug("Sending message", message, "to", roomName);

        connection.send(message);
    }

    private async handleDisconnect(group: string, url: string) {

        logger.debug("Connection closed for", group);
        const attempts = this.reconnectAttempts.get(group) || 0;
    
        if (attempts < this.maxReconnectAttempts) {
            console.debug(`Attempting to reconnect to ${group}...`);
            this.reconnectAttempts.set(group, attempts + 1);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.createConnection(group, url);
        }
    }

    public closeConnection(group: string) {
        const connection = this.connections.get(group);
        console.debug("Closing connection for", group);

        if (connection) {
            connection.close();
            this.connections.delete(group);
            this.reconnectAttempts.delete(group);
            this.initMessages.delete(group);
        }
    }

    public closeAllConnections() {
        for (const [group] of this.connections) {
            this.closeConnection(group);
        }
        this.initMessages.clear();
    }

    getConnection(group: string): WebSocket | undefined {
        return this.connections.get(group);
    }

    public setInitMessage(group: string, message: string) {
        this.initMessages.set(group, message);
    }
}