import 'dotenv/config';
import { REST } from '@discordjs/rest';
import type { RESTPutAPIApplicationGuildCommandsResult } from 'discord-api-types/v10';
import { Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { SlashCommandBuilder } from 'discord.js';

const appId:string = process.env.APP_ID || '';
const token:string = process.env.DISCORD_TOKEN || '';
const guildId:string = process.env.GUILD_ID || '';

// Grab all the command folders from the commands directory you created earlier
// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: ReturnType<SlashCommandBuilder['toJSON']>[] = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);
    	const command = commandModule.default ?? commandModule;
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} ${token} application (/) commands.`);

		const rest = new REST({ version: '10' }).setToken(token);
		const data = await rest.put(
      Routes.applicationGuildCommands(appId, guildId),
      { body: commands },
    ) as RESTPutAPIApplicationGuildCommandsResult;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
