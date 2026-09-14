import 'dotenv/config';
import { REST } from '@discordjs/rest';
import type { RESTPutAPIApplicationGuildCommandsResult } from 'discord-api-types/v10';
import { Routes } from 'discord.js';
import { fileURLToPath } from 'node:url';
import type { SlashCommandBuilder } from 'discord.js';
import LoadFiles from "./utility/loadFiles";

const appId:string = process.env.APP_ID || '';
const token:string = process.env.DISCORD_TOKEN || '';

const rootPath = fileURLToPath(import.meta.url);
const fileList2 = await LoadFiles(rootPath, 'commands');
const commands: ReturnType<SlashCommandBuilder['toJSON']>[] = [];
for (const file of fileList2) {
	const commandModule = await import(file);
	const command = commandModule.default ?? commandModule;
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} ${token} application (/) commands.`);
		const rest = new REST({ version: '10' }).setToken(token);
		const data = await rest.put(Routes.applicationCommands(appId), { body: commands }) as RESTPutAPIApplicationGuildCommandsResult;
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
