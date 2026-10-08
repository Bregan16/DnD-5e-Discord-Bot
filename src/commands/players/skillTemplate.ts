import {
	ChatInputCommandInteraction, ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { getDifficultyClass } from '../../utility/chracterUtils';
import { createBonusMaldsRespondsData, getBuffModal } from '../../utility/discordUi';
import { SLASH_COMMAND_LIST } from '../../utility/const';
import { doSkillCheck } from '../../utility/chracterUtils';

export default {
	data: new SlashCommandBuilder().setName(SLASH_COMMAND_LIST.SKILL_TEMPLATE).setDescription('Do a skillTemplate check!'),

	async execute(interaction: ChatInputCommandInteraction) {
		const skillName = interaction.commandName;
		const modal = await getBuffModal(skillName);
		await interaction.showModal(modal);
	},

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient, options:RespondsOption) {
		try {
			const {
				userName,
				isDebuff,
				rollOptions,
				diceBonusMalus,
				flatBonusMalus,
				advantageDisadvantage,
			} = createBonusMaldsRespondsData(interaction, options);

			const char = discordClient?.characters?.get(userName);
			const character = char?.character;
			const rollResult = doSkillCheck(character, options.skill, rollOptions);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (diceBonusMalus.length === 0 && flatBonusMalus.length === 0) {
				content = `${character?.basicInfo.name}, did a **${options.skill}** skill check without a buff ${advantageDisadvantage !== 'no' ? 'and with ' + advantageDisadvantage + ', ' : ''}, the result is: **${rollResult.rendered}** (DC: ${difficultyClass})`;
			}
			else {
				content = `${character?.basicInfo.name}, did a **${options.skill}** skill check with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff} ${rollOptions.buffDice},  ${advantageDisadvantage !== 'no' ? 'and ' + advantageDisadvantage + ', ' : ''}, the result is: **${rollResult.rendered}** (DC: ${difficultyClass})`;
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
