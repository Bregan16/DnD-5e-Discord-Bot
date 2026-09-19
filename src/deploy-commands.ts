import 'dotenv/config';
import { REST } from '@discordjs/rest';
import type { RESTPutAPIApplicationGuildCommandsResult } from 'discord-api-types/v10';
import { Routes } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { SKILL_LIST } from './utility/const';
import { allCommands } from "./commands";

const appId:string = process.env.APP_ID || '';
const token:string = process.env.DISCORD_TOKEN || '';

const commands: any[] = [];

for (const command of allCommands.common) {
	const commandName = command.data.name;
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
		console.log('## ', commandName );
	} else {
		console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
	}
}

for (const specialCommand of allCommands.special) {
	const commandName = specialCommand.data.name;
	if ('data' in specialCommand && 'execute' in specialCommand) {
		console.log('## ', commandName );
		if(commandName === 'skilltemplate') {
			for (const skill of SKILL_LIST) {
				commands.push(new SlashCommandBuilder().setName(skill).setDescription(`Do a ${skill} check.`).toJSON());
				console.log('##  -', skill );
			}
		}
	} else {
		console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
	}
}

(async () => {
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
