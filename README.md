# D&D 5e Discord Bot

A Discord bot for Dungeons & Dragons 5e that provides character information and game interactions.

**Repository:** [Bregan16/DnD-5e-Discord-Bot](https://github.com/Bregan16/DnD-5e-Discord-Bot)

## Project structure
Below is an overview of the project structure:

```
├── src
│   ├── examples         -> feature-specific example implementations
│   ├── app.ts           -> main entrypoint for bot client
│   ├── commands.ts      -> slash command definitions and registration
│   ├── interactionHandler.ts -> slash command response logic
│   ├── game.ts          -> game logic (rock-paper-scissors)
│   ├── utils.ts         -> utility functions and enums
│   └── assets           -> static assets
├── dist                 -> compiled TypeScript output
├── tests                -> Jest unit tests
├── .env.sample          -> sample environment variables
├── package.json         -> dependencies and scripts
├── tsconfig.json        -> TypeScript configuration
├── jest.config.js       -> Jest test configuration
└── README.md
```

## Running app locally

Before you start, you'll need to install [NodeJS](https://nodejs.org/en/download/) and [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages enabled)


Configuring the app is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

### Setup project

First clone the project:
```bash
git clone https://github.com/Bregan16/DnD-5e-Discord-Bot.git
cd DnD-5e-Discord-Bot
```

Then install dependencies:
```bash
npm install
```
### Get app credentials

1. Create a Discord application at [Discord Developers](https://discord.com/developers/applications)
2. Copy your app ID and bot token
3. Create a `.env` file (see `.env.sample` for an example):
   ```bash
   cp .env.sample .env
   # Edit .env and add your credentials:
   # APP_ID=your_app_id
   # DISCORD_TOKEN=your_bot_token
   ```

See the [Discord getting started guide](https://discord.com/developers/docs/getting-started) for detailed instructions.

### Build and register commands

Build the TypeScript project:
```bash
npm run build
```

Register slash commands with Discord:
```bash
npm run register
```

The commands are defined in `src/commands.ts` and include:
- `/test` - Basic test command
- `/challenge` - Challenge to rock-paper-scissors
- `/char_info` - Get character information

### Run the bot

After registering commands, run the bot in development mode:
```bash
npm run dev
```

The bot watches for local changes and restarts automatically using `tsx`.

Alternatively, run the compiled version:
```bash
npm run build
npm start
```

### Testing

Run the test suite:
```bash
npm test
```

Watch mode (useful during development):
```bash
npm run test:watch
```

## Resources
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Discord Developers Server](https://discord.gg/discord-developers)

## Technology Stack
- **Language:** TypeScript
- **Discord Library:** discord.js v14+
- **Node.js Version:** 18.x or higher
- **Testing:** Jest
- **Build Tool:** TypeScript Compiler (tsc)


## Git
```bash
git add * 
git commit -m "Add Char Data" 
git push 
```