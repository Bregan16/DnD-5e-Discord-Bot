import 'dotenv/config';
import { REST } from '@discordjs/rest';
import type { RESTPutAPIApplicationGuildCommandsResult } from 'discord-api-types/v10';
import { Routes } from 'discord.js';
import { fileURLToPath } from 'node:url';
import LoadFiles from './utility/loadFiles';
import { SlashCommandBuilder } from 'discord.js';
import { SKILL_LIST } from './utility/const';

const appId:string = process.env.APP_ID || '';
const token:string = process.env.DISCORD_TOKEN || '';

const rootPath = fileURLToPath(import.meta.url);
const fileList2 = await LoadFiles(rootPath, 'commands');
const commands: any[] = [];
for (const file of fileList2) {
	const commandModule = await import(file);
	const command = commandModule.default ?? commandModule;
	if(command.data.name !== 'skilltemplate') {
		if ('data' in command && 'execute' in command) {
			console.log('## ', command.data.name );
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
		}
	}
}

(async () => {
		for (const skill of SKILL_LIST) {
		console.log('##   ', skill );
		commands.push(new SlashCommandBuilder().setName(skill).setDescription(`Do a ${skill} check.`).toJSON());
	}
	try {
		console.log(`Started refreshing ${commands.length} ${token} application (/) commands.`);
		const rest = new REST({ version: '10' }).setToken(token);
		const data = await rest.put(Routes.applicationCommands(appId), { body: commands }) as RESTPutAPIApplicationGuildCommandsResult;
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
