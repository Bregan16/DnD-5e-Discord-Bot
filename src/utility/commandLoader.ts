import {
	Collection, SlashCommandBuilder,
} from 'discord.js';
import { SKILL_LIST } from './const';
import { allCommands } from "../commands";

export default async function CommandLoader(discordClient: DiscordClient) {
	discordClient.commands = new Collection();
	for (const command of allCommands.common) {
		const commandName = command.data.name;
		if ('data' in command && 'execute' in command) {
			discordClient.commands.set(commandName, command);
			console.log('## ', commandName );
		} else {
			console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
		}
	}
	for (const specialCommand of allCommands.special) {
		const commandName = specialCommand.data.name;
		console.log('## ', commandName );
		if(commandName === 'skilltemplate') {
			for (const skill of SKILL_LIST) {
				const copy = JSON.parse(JSON.stringify(specialCommand));
				copy.data = new SlashCommandBuilder().setName(skill).setDescription(`Do a ${skill} check!`).toJSON();
				copy.execute = specialCommand?.execute;
				discordClient.commands.set(skill, copy);
				console.log('##  -', skill );
			}
		}
	}
}
