export const MessageTypes = new Map([
    ['ok', 'ok'],
    ['b', 'message'],
    ['nomore', 'noMoreMessages'],
])

export function parseRawMessage(message: string) {
    const [messageType, ...args] = message.split(':');
    return { messageType, args };
}