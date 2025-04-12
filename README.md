# chatango.js

A TypeScript library for interfacing with Chatango groups and PMs.

## Features
- Connect to Chatango chat rooms
- Handle messages and user events
- Support for authentication
- TypeScript native implementation

## Installation

```bash
bun install chatango.js
```

## Usage

```typescript
import { ChatangoBot } from "chatango.js";

const bot = new ChatangoBot(["roomname"], "username", "password");

async function main() {
    await bot.connect();
    // Bot is now connected and ready
}

main().catch(console.error);
```

## Development

To install dependencies:
```bash
bun install
```

To run the example bot:
```bash
bun run example/bot.ts
```

## License
GNU General Public License v3.0

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
