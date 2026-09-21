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
			const command = discordClient.commands.get(interaction.customId);
			if (!command) {
				console.error(`No command matching ${interaction.customId} was found.`);
				return;
			}

			console.log(interaction.customId);
			try {
				await command.responds(interaction, discordClient);
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
