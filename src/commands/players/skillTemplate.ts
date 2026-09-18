import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { doSkillCheck, getDifficultyClass } from '../../utility/chracterUtils';
import { createAdvantageRow, createBuffRows, runTwoStepButtonPrompt } from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('skilltemplate').setDescription('Do a skillTemplate check!'),
	execute: async (
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) => {
		try {
			const { buffRow, deBuffRow, noBuffRow } = createBuffRows();
			const advantageRow = createAdvantageRow();

			const { firstChoice, secondChoice } = await runTwoStepButtonPrompt(
				interaction,
				'Select a buff for your check!',
				[buffRow, deBuffRow, noBuffRow],
				'Now choose Advantage/Disadvantage for your check!',
				[advantageRow],
			);

			const selectedBuff = firstChoice.customId;
			const selectedMode = secondChoice.customId;
			const isDebuff = selectedBuff.startsWith('-');
			const rollOptions: SkillRollOptions = {
				buff: '',
			};

			if (selectedBuff !== 'noBuff') {
				rollOptions.buff = selectedBuff;
			}

			if (selectedMode === 'advantage' || selectedMode === 'disadvantage') {
				rollOptions.advantage = selectedMode;
			}

			const userName = interaction.user.username;
			const skillName = interaction.commandName;
			const char = discordClient?.characters?.get(userName);
			const rollResult = doSkillCheck(char?.character, skillName, rollOptions);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (selectedBuff === 'noBuff') {
				content = `${userName}, did a **${skillName}** check without a buff ${selectedMode !== 'non' ? 'and with ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${skillName}** check with a ${isDebuff ? 'de' : ''}buff of ${selectedBuff},  ${selectedMode !== 'non' ? 'and ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			await secondChoice.update({
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
