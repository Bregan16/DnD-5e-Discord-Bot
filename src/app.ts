import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from 'discord.js';

import CommandLoader from './utility/commandLoader'
import CharacterManager from './utility/chracterLoader'
import EventUtility from './utility/eventUtility'

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const rootPath = fileURLToPath(import.meta.url);
await CommandLoader(discordClient, rootPath);
await CharacterManager(discordClient, rootPath);
await EventUtility(discordClient);

if (process.env.NODE_ENV !== 'test') {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('DISCORD_TOKEN is required');
  }
  void discordClient.login(token);
}

export { discordClient };
