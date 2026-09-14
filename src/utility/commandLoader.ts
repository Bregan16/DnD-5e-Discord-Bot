import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  Collection,
} from 'discord.js';

export default async function CommandLoader(discordClient: DiscordClient, rootPath: string) {
    discordClient.commands = new Collection();

    const __dirname = path.dirname(rootPath);
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
    	const commandsPath = path.join(foldersPath, folder);
    	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
    	for (const file of commandFiles) {
    		const filePath = path.join(commandsPath, file);
            const commandModule = await import(pathToFileURL(filePath).href);
        	const command = commandModule.default ?? commandModule;
    		// Set a new item in the Collection with the key as the command name and the value as the exported module
    		if ('data' in command && 'execute' in command) {
    			discordClient.commands.set(command.data.name, command);
    		} else {
    			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    		}
    	}
    }
}
