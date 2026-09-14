import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
	async execute(interaction, discordClient) {
		const charName = discordClient.characters.get(interaction.user.username).character.basicInfo.name
		await interaction.reply(
			`This command was run by ${interaction.user.username}, who joined on with char name of ${charName}.`,
		);
	},
};
