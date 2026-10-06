import {
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { doAbilityCheck } from '../../utility/chracterUtils';
import { SLASH_COMMAND_LIST } from '../../utility/const';

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.INITIATIVE)
		.setDescription('Roll initiative for combat.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('roll')
				.setDescription('Roll a d20 and add your Dexterity modifier.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('show')
				.setDescription('Show the current combat initiative order.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove your character from the initiative order.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('clear')
				.setDescription('Clear the initiative order.')),

	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		const subcommand = interaction.options.getSubcommand();

		const character = discordClient.characters
			.get(interaction.user.username)?.character;
		if (!character) {
			await interaction.reply({
				content: 'No character found for your Discord account.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (subcommand === 'roll') {
			const result = doAbilityCheck(character, 'dexterity');
			discordClient.combat.addCharacterToInitiative(character, result.total);
			await interaction.reply({
				content: `${character.basicInfo.name} rolled initiative: **${result.rendered}**`,
			});
		}

		if (subcommand === 'show') {
			const initiativeOrder = discordClient.combat.showInitiativeOrder();
			await interaction.reply({
				content: initiativeOrder || 'No characters are in the initiative order.',
			});
			return;
		}

		if (subcommand === 'remove') {
			const wasRemoved = discordClient.combat.removeCharacterFromInitiative(character.basicInfo.discordId);
			await interaction.reply({
				content: wasRemoved
					? `Removed ${character.basicInfo.name} from the initiative order.`
					: `${character.basicInfo.name} is not in the initiative order.`,
			});
			return;
		}

		if (subcommand === 'clear') {
			discordClient.combat.clearInitiativeOrder();
			await interaction.reply({
				content: 'Cleared the initiative order.',
			});
			return;
		}

		return;
	},
};
