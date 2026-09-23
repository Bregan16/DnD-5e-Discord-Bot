import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

import { getBuffModal } from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with a big Pong!'),

	async execute(interaction: ChatInputCommandInteraction, discordClient: DiscordClient) {
		await interaction.reply('Pong!');
	},
};
