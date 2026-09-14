import {
  Collection,
} from 'discord.js';
import LoadFiles from "./loadFiles";

export default async function CommandLoader(discordClient: DiscordClient, rootPath: string) {
	const fileList = await LoadFiles(rootPath, 'commands');

	discordClient.commands = new Collection();
	for (const file of fileList) {
		const commandModule = await import(file);
		const command = commandModule.default ?? commandModule;
		if ('data' in command && 'execute' in command) {
			discordClient.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
		}
	}
}
