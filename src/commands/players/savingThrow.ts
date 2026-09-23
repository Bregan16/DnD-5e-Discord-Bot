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
			const { buffRow, deBuffRow, noBuffRow } = createBuffRows();
			const advantageRow = createAdvantageRow();

			const { firstChoice, secondChoice, thirdChoice } = await runThreeStepButtonPrompt(
				interaction,
				'Select the attribute for your saving throw!',
				[actionFirstRow, actionSecondRow],
				'Select a buff for your saving throw!',
				[buffRow, deBuffRow, noBuffRow],
				'Now choose Advantage/Disadvantage for your saving throw!',
				[advantageRow],
			);

			const selectedSavingThrow = firstChoice.customId;
			const selectedBuff = secondChoice.customId;
			const selectedMode = thirdChoice.customId;
			const isDebuff = selectedBuff.startsWith('-');
			const rollOptions: SkillRollOptions = {
				buff: '',
				buffDice: '',
				advantage: 'no',
			};

			if (selectedBuff !== 'noBuff') {
				rollOptions.buff = selectedBuff;
			}

			if (selectedMode === 'advantage' || selectedMode === 'disadvantage') {
				rollOptions.advantage = selectedMode;
			}

			const userName = interaction.user.username;
			const abilityName = selectedSavingThrow;
			const char = discordClient?.characters?.get(userName);
			const rollResult = doSavingThrowCheck(char?.character, abilityName, rollOptions);

			let content:string;
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (selectedBuff === 'noBuff') {
				content = `${userName}, did a **${abilityName}** saving throw without a buff ${selectedMode !== 'no' ? 'and with ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${abilityName}** saving throw with a ${isDebuff ? 'de' : ''}buff of ${selectedBuff},  ${selectedMode !== 'no' ? 'and ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
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
