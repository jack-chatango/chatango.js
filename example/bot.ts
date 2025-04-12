import { ChatangoBot } from "../src/ChatangoBot";

/* Theortically, you should implement your own logger - but this one will do for the example */
import logger from "../src/utils/logger";

const bot = new ChatangoBot(["myroom"], "mybot", "mybotpassword");

async function main() {
    await bot.connect();
    
    const cleanup = async () => {
        logger.info('Bot shutting down...');
        
        try {
        } catch (error) {
            logger.error('Error during disconnect: {0}', error);
        }

        process.exit(0);
    };

    const forever = new Promise<void>((resolve) => {
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('SIGBREAK', cleanup);  // Windows-specific signal
    });

    await forever;
}

main().catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
});