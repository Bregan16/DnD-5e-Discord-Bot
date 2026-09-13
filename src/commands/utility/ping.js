import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction, discordClient) {
		await interaction.reply('Pong!');
	},
};
