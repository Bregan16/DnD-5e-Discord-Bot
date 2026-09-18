import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { doSavingThrowCheck, getDifficultyClass } from '../../utility/chracterUtils';
import {
	createAbilityRow,
	createAdvantageRow,
	createBuffRows,
	runThreeStepButtonPrompt,
} from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('savingthrow').setDescription('Do a saving throw check!'),
	execute: async (
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) => {
		try {
			const { actionFirstRow, actionSecondRow } = createAbilityRow();
			const { row1, row2, row3 } = createBuffRows();
			const row4 = createAdvantageRow();

			const { firstChoice, secondChoice, thirdChoice } = await runThreeStepButtonPrompt(
				interaction,
				'Select the ability for your check!',
				[actionFirstRow, actionSecondRow],
				'Select a buff for your check!',
				[row1, row2, row3],
				'Now choose Advantage/Disadvantage for your check!',
				[row4],
			);

			const selectedAbility = firstChoice.customId;
			const selectedBuff = secondChoice.customId;
			const selectedMode = thirdChoice.customId;
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
			const abilityName = selectedAbility;
			const char = discordClient?.characters?.get(userName);
			const rollResult = doSavingThrowCheck(char?.character, abilityName, rollOptions);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (selectedBuff === 'noBuff') {
				content = `${userName}, did a **${abilityName}** saving throw without a buff ${selectedMode !== 'non' ? 'and with ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${abilityName}** saving throw with a ${isDebuff ? 'de' : ''}buff of ${selectedBuff},  ${selectedMode !== 'non' ? 'and ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			await thirdChoice.update({
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
