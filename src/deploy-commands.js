import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appId = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

// Grab all the command folders from the commands directory you created earlier
// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
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

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} ${token} application (/) commands.`);

        const rest = new REST({ version: '10' }).setToken(token);
        const data = await rest.put(Routes.applicationCommands(appId, guildId), { body: commands });

		// The put method is used to fully refresh all commands in the guild with the current set
		// const data = await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
