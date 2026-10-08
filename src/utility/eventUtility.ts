import {
	Events,
	MessageFlags,
} from 'discord.js';
import {CUSTOM_COMMAND_SPLIT, SLASH_COMMAND_LIST} from "./const";

export default async function EventUtility(discordClient: DiscordClient) {
	discordClient.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}!`);
	});


	discordClient.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isModalSubmit()) {
			const customCommand = interaction.customId;
			let commandId:string;
			const options = {
				ability: '',
				skill: '',
				weapon: '',
			};
			console.log('## customId', customCommand);
			if (customCommand.startsWith(CUSTOM_COMMAND_SPLIT)) {
				const [activity, activityOption] = customCommand
					.split(CUSTOM_COMMAND_SPLIT)[1]
					.split('_');
				commandId = activity;
				if (activity === SLASH_COMMAND_LIST.ATTACK) {
					options.weapon = activityOption;
				} else {
					options.ability = activityOption;
				}
			} else {
				commandId = customCommand;
				options.skill = customCommand;
			}
			const command = discordClient.commands.get(commandId);
			if (!command) {
				console.error(`No command matching ${commandId} was found.`);
				return;
			}
			try {
				console.log('## command', command.data.name, options);
				await command.responds?.(interaction, discordClient, options);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				}
				else {
					await interaction.reply({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}

		if (!interaction.isChatInputCommand()) return;
    	const command = discordClient.commands.get(interaction.commandName);
    	if (!command) {
    		console.error(`No command matching ${interaction.commandName} was found.`);
    		return;
    	}

    	try {
    		await command.execute(interaction, discordClient);
    	}
		catch (error) {
    		console.error(error);
    		if (interaction.replied || interaction.deferred) {
    			await interaction.followUp({
    				content: 'There was an error while executing this command!',
    				flags: MessageFlags.Ephemeral,
    			});
    		}
			else {
    			await interaction.reply({
    				content: 'There was an error while executing this command!',
    				flags: MessageFlags.Ephemeral,
    			});
    		}
    	}
	});
}
