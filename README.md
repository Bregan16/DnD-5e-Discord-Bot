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

Spell lookups use the D&D 5e 2024 GraphQL API:
- `/spell name:Fire Bolt` - Show a spell's description and details, including its school.
- `/spelllist class:Wizard` - Show the class's spells, sorted by level and name,
  including each spell's index and school. Each level has its own headline and
  embed in one private reply. Lists exceeding Discord's embed limits are attached
  as a complete text file, grouped by level.
- `/spelllist school:Evocation` - Show spells from a spell school in the same format.
  Provide either `class` or `school`, not both.
  Spell lists include a clickable `/spell` command shortcut; enter the spell name
  after clicking it. If the shortcut cannot be resolved, `/spell` is shown as plain text.
  Each spell also includes a command such as `/spell name:Fire Bolt` for manual
  copying, both in embeds and in the text attachment.

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

## GraphQL
- https://medium.com/@tokosbex/graphql-and-node-js-part-1-f54669498383
- https://medium.com/@tokosbex/node-js-and-graphql-part-2-14583be41620
- https://docs.dnd5eapi.co/tutorials/beginner/graphql
- https://studio.apollographql.com/sandbox/explorer


```bash
query Monsters2024($index: String!, $spellIndex2: String!, $spellIndex3: String!) {
    spell(index: $spellIndex2) {
      name
      description
      range
      level
      higher_level
      duration
      ritual
      material
      attack_type
      casting_time
    }
    spells {
      name
      index
    }
    monster2024(index: $index) {
      name
      hit_dice
      hit_points
      actions {
        name
        damage {
          ... on Damage {
            damage_dice
            damage_type {
              name
            }
          }
        }
      }
    }
    classes {
      name
      subclasses {
        name
      }
    }
    monsters2024 {
      name
    }
  }
}
Variables:
{
  "index": "adult-black-dragon",
  "spellIndex2": "hunters-mark"
}
```

## MongoDB character model

`mongodb/models/characters.js` exports the Mongoose `Character` model (default)
and `characterSchema` (named), based on `src/chars/gnome-ranger-character.json`.
It preserves the top-level `character` wrapper and original field names, including
weapon `Weight` and weapon proficiency `Simple`/`Martial`. Nested documents do not
receive extra `_id` fields. Discord IDs are indexed but not unique, allowing more
than one character per user.

To import a character from JSON in a Node.js ES module:

```js
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import Character from './mongodb/models/characters.js';

await mongoose.connect('mongodb://127.0.0.1:27017/discordBotDB');
const data = JSON.parse(readFileSync('./src/chars/gnome-ranger-character.json', 'utf8'));
await Character.create(data);
await mongoose.disconnect();
```

The model validates required character data, integer scores and counters,
nonnegative currency and hit points, and character levels from 1 to 20.
Spellcasting and subspecies are optional; armor may be absent or `null`, and
shield is a string such as `"None"`, matching the source JSON.
This model does not change the bot's existing file-based character loader or add
GraphQL character operations.

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