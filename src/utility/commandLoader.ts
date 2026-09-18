import {
	Collection, SlashCommandBuilder,
} from 'discord.js';
import LoadFiles from './loadFiles';
import { SKILL_LIST } from './const';

export default async function CommandLoader(discordClient: DiscordClient, rootPath: string) {
	const fileList = await LoadFiles(rootPath, 'commands');

	discordClient.commands = new Collection();
	let test: any = null;
	for (const file of fileList) {
		const commandModule = await import(file);
		const command = commandModule.default ?? commandModule;
		if(test === null && command.data.name === 'skilltemplate') {
			test = command;
		} else {
			if ('data' in command && 'execute' in command) {
				discordClient.commands.set(command.data.name, command);
			}
			else {
				console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
			}
		}
	}

	for (const skill of SKILL_LIST) {
		const copy = JSON.parse(JSON.stringify(test));
		copy.data = new SlashCommandBuilder().setName(skill).setDescription(`Do a ${skill} check!`).toJSON();
		copy.execute = test?.execute;
		discordClient.commands.set(skill, copy);
	}
}
