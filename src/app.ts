import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import {
	Client,
	GatewayIntentBits,
} from 'discord.js';

import { CommandLoader, CharacterManager, EventUtility } from './utility/utility';

const discordClient = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as DiscordClient;

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
