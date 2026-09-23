import {
	Events,
	MessageFlags,
} from 'discord.js';

export default async function EventUtility(discordClient: DiscordClient) {
	discordClient.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}!`);
	});


	discordClient.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isModalSubmit()){
			const customCommand = interaction.customId;
			let commandId = ''
			const options = {
				ability: '',
			};
			console.log('## customId', customCommand);
			if(customCommand.startsWith('splitt_command_')) {
				const commandParts = customCommand.split('splitt_command_');
				const commandIdAbility = commandParts[1].split('_');
				commandId = commandIdAbility[0];
				options.ability = commandIdAbility[1];
			} else {
				commandId = customCommand;
			}
			const command = discordClient.commands.get(commandId);
			if (!command) {
				console.error(`No command matching ${commandId} was found.`);
				return;
			}
			try {
				console.log('## command', command.data.name, options );
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
