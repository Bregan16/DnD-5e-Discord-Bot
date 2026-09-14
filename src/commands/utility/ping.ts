import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with a big Pong!'),
	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		await interaction.reply('Pong!');
	},
};
