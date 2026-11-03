import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import {
	Client,
	GatewayIntentBits,
} from 'discord.js';

import { CommandLoader, CharacterManager, EventUtility, CombatUtility, GraphQLClient } from './utility';

const discordClient = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as DiscordClient;

const rootPath = fileURLToPath(import.meta.url);
await CommandLoader(discordClient);
await CharacterManager(discordClient, rootPath);
await EventUtility(discordClient);
await CombatUtility(discordClient);
await GraphQLClient(`
  {
	  getAllProduct {
		id
		description
		price
	  }
	}
`);

if (process.env.NODE_ENV !== 'test') {
	const token = process.env.DISCORD_TOKEN;
	if (!token) {
		throw new Error('DISCORD_TOKEN is required');
	}
	void discordClient.login(token);
}

export { discordClient };
