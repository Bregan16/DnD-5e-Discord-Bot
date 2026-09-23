import {
	ChatInputCommandInteraction, ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { getDifficultyClass } from '../../utility/chracterUtils';
import {createBonusMaldsRepondsData, getBuffModal} from '../../utility/discordUi';
import { SLASH_COMMAND_LIST } from '../../utility/const';

export default {
	data: new SlashCommandBuilder().setName(SLASH_COMMAND_LIST.SKILL_TEMPLATE).setDescription('Do a skillTemplate check!'),

	async execute(interaction: ChatInputCommandInteraction) {
		const skillName = interaction.commandName;
		const modal = await getBuffModal(skillName);
		await interaction.showModal(modal);
	},

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient, options: any) {
		try {
			const {
				rollResult,
				userName,
				name,
				isDebuff,
				rollOptions,
				diceBonusMalus,
				flatBonusMalus,
				advantageDisadvantage
			} = createBonusMaldsRepondsData(interaction, discordClient, options);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (diceBonusMalus.length === 0 && flatBonusMalus.length === 0) {
				content = `${userName}, did a **${name}** skill check without a buff ${advantageDisadvantage !== 'no' ? 'and with ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${name}** skill check with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff} ${rollOptions.buffDice},  ${advantageDisadvantage !== 'no' ? 'and ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}

			await interaction.reply({
				content,
				components: [],
			});
		}
		catch (error) {
			console.error('Error during confirmation:', error);
			await interaction.editReply({
				content: 'Confirmation not received within 1 minute, cancelling',
				components: [],
			});
		}
	},
};
