import type { ChatangoBot } from "./ChatangoBot";
import { SPECIAL_CHATANGO_ROOMS, TS_WEIGHTS } from "./utils/constants";
import logger from "./utils/logger";
import { genUid } from "./utils/utils";
import { MessageHandler } from './messages/MessageHandler';
import { AuthMessage } from './messages/AuthMessage';
import { ChatMessage } from "./messages/ChatMessage";
import { GParticipantsMessage } from "./messages/GParticipantsMessage";

const MIN_LNV_VALUE = 1000;

export class Room {

    private _correctionTime = 0;

    private server: string;
    private uid: string;
    private messageHandler: MessageHandler;

    constructor(public name: string, private bot: ChatangoBot) {
        this.uid = genUid();
        this.server = this.getServer(name);
        this.messageHandler = new MessageHandler(this);
    }

    async connect(username: string, password: string) {

        // Connect to Chatango
        const ws = await this.bot.connectionManager.createConnection(this.name, `wss://${this.server}:8081/`);


        ws.addEventListener('message', (event) => {
            this.handleWebSocketMessage(event.data.toString());
        });

        this.authenticate(username, password);
    }

    sendSocketMessage(messsageType: 'bauth', terminator = "\r\n\0", ...args: string[]) {
        // Send message to Chatango
        const fullMessage = [messsageType, ...args].join(':') + terminator;
        this.bot.connectionManager.sendMessage(this.name, fullMessage);
    }


    private authenticate(username: string, password: string) {
        const authMessage = new AuthMessage(
            this.name,
            this.uid,
            username,
            password
        );

        const connection = this.bot.connectionManager.getConnection(this.name);
        if (!connection) {
            throw new Error(`Connection for room "${this.name}" not found`);
        }

        const message = authMessage.serialize();
        this.bot.connectionManager.sendMessage(this.name, message);
        this.bot.connectionManager.setInitMessage(this.name, message);

        this.bot.connectionManager.sendMessage(this.name, new GParticipantsMessage().serialize());
    }

    handleWebSocketMessage(data: string) {
        const message = this.messageHandler.handleMessage(data);
        if (message) {

            if (message instanceof ChatMessage) {
                logger.info(`[${this.name}] ${message.user?.name}: ${message.text}`);
            }

            // Handle different message types
            // You can use instanceof to check message types
        } else {
            logger.warn(`[${this.name}] Unhandled message: ${data}`);
        }
    }

    getUser(user: string) {
        return null;
    }

    /**
     * Determines the server hostname for a Chatango room using their weighted distribution algorithm.
     * Special rooms have fixed servers, while others use a deterministic hashing approach.
     * @param name The room name to get the server for
     * @returns The server hostname (e.g. "s1.chatango.com")
     */
    private getServer(name: string): string {
        if (!name || typeof name !== 'string') {
            throw new Error('Room name must be a non-empty string');
        }

        let serverNumber: number | undefined;

        if (SPECIAL_CHATANGO_ROOMS.has(name)) {
            serverNumber = SPECIAL_CHATANGO_ROOMS.get(name);
        } else {
            // Normalize room name
            const normalizedName = name
                .replace("_", "q")
                .replace("-", "q");

            // First 5 chars as base36 number (First Numerical Value)
            const firstNumericalValue = parseInt(normalizedName.slice(0, 5), 36);

            // Chars 6-9 as base36 number (Last Numerical Value)
            const lastNumericalValue = normalizedName.slice(6, 9);
            const lnv = lastNumericalValue
                ? Math.max(parseInt(lastNumericalValue, 36), MIN_LNV_VALUE)
                : MIN_LNV_VALUE;

            // Calculate normalized distribution value (0-1)
            const distributionValue = (firstNumericalValue % lnv) / lnv;

            // Get total weight for distribution calculation
            const totalWeight = TS_WEIGHTS.reduce((sum, [_, weight]) => sum + weight, 0);

            // Find server using weighted distribution
            let cumulativeFrequency = 0;
            for (const [server, weight] of TS_WEIGHTS) {
                cumulativeFrequency += weight / totalWeight;
                if (distributionValue <= cumulativeFrequency) {
                    serverNumber = server;
                    break;
                }
            }
        }

        if (serverNumber == null) {
            throw new Error(`Failed to determine server for room "${name}"`);
        }

        return `s${serverNumber}.chatango.com`;
    }
}