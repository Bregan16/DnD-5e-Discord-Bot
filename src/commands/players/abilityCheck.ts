import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { doAbilityCheck, getDifficultyClass } from '../../utility/chracterUtils';
import {
	createAbilityRow,
	createAdvantageRow,
	createBuffRows,
	runThreeStepButtonPrompt,
} from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('abilitycheck').setDescription('Do an ability check!'),
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
				'Select the ability for your check!',
				[actionFirstRow, actionSecondRow],
				'Select a buff for your check!',
				[buffRow, deBuffRow, noBuffRow],
				'Now choose Advantage/Disadvantage for your check!',
				[advantageRow],
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
			const rollResult = doAbilityCheck(char?.character, abilityName, rollOptions);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (selectedBuff === 'noBuff') {
				content = `${userName}, did a **${abilityName}** check without a buff ${selectedMode !== 'non' ? 'and with ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${abilityName}** check with a ${isDebuff ? 'de' : ''}buff of ${selectedBuff},  ${selectedMode !== 'non' ? 'and ' + selectedMode + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
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
