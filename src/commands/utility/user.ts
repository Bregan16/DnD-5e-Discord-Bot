import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.'),
	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		console.log('## discordClient?.characters ',  interaction.user.username, discordClient?.characters);
		const char = discordClient?.characters?.get(interaction.user.username)?.character;
		const charName = char?.basicInfo?.name;
		const className = char?.basicInfo?.class;
		let content = `**${interaction.user.username}** is playing a **${className}** with the name of **${charName}**.`;
		if (charName === undefined || className === undefined) {
			content = `No character information found for **${interaction.user.username}**.`;
		}
		await interaction.reply({
			content
		});
	},
};
