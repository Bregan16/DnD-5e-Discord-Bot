import { ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		const charName = discordClient?.characters?.get(interaction.user.username)?.character?.basicInfo?.name;
		const className = discordClient?.characters?.get(interaction.user.username)?.character?.basicInfo?.class;
		await interaction.reply({
			content: `${interaction.user} is playing a ${className} with the name of ${charName}.`,
			flags: MessageFlags.Ephemeral,
		});
	},
};
