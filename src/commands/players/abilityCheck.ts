import {
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
	MessageFlags,
} from 'discord.js';
import { doAbilityCheck, getDifficultyClass } from '../../utility/chracterUtils';
import {
	createAbilityRow,
	createAdvantageRow,
	createBuffRows, getBuffModal, runOneStepButtonPrompt,
	runThreeStepButtonPrompt,

} from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('abilitycheck').setDescription('Do an ability check!'),

	async execute(interaction: ChatInputCommandInteraction, discordClient: DiscordClient) {

		// runOneStepButtonPrompt
		const { actionFirstRow, actionSecondRow } = createAbilityRow();
		const { firstChoice } = await runOneStepButtonPrompt(
			interaction,
			'Select the ability for your check!',
			[actionFirstRow, actionSecondRow],
		);
		console.log('## firstChoice', interaction.commandName, firstChoice.customId );
		const skillName = interaction.commandName;
		const modal = await getBuffModal(`splitt_command_${skillName}_${firstChoice.customId}`);
		await firstChoice.showModal(modal);
		await interaction.deleteReply();
	},

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient, options: any) {
		console.log('## responds', options, interaction.fields);

		const diceBonusMalus = interaction.fields.getStringSelectValues('diceBonusMalus');
		const flatBonusMalus = interaction.fields.getStringSelectValues('flatBonusMalus');
		const advantageDisadvantage = interaction.fields.getRadioGroup('advantageDisadvantage');
		console.log(diceBonusMalus, flatBonusMalus, advantageDisadvantage);
		const rollOptions: SkillRollOptions = {
			buff: '',
			buffDice: '',
			advantage: 'no',
		};

		if (diceBonusMalus[0] !== undefined) {
			rollOptions.buff = diceBonusMalus[0];
		}

		if (flatBonusMalus[0] !== undefined) {
			rollOptions.buffDice = flatBonusMalus[0];
		}

		if (advantageDisadvantage && advantageDisadvantage !== 'no') {
			rollOptions.advantage = advantageDisadvantage as 'advantage' | 'disadvantage' | 'no';
		}
		try {
			const userName = interaction.user.username;
			const abilityName = options.ability;
			const isDebuff = rollOptions.buff.startsWith('-');
			const char = discordClient?.characters?.get(userName);
			const rollResult = doAbilityCheck(char?.character, abilityName, rollOptions);

			let content = '';
			const difficultyClass = getDifficultyClass(rollResult.total);
			if (diceBonusMalus.length === 0 && flatBonusMalus.length === 0) {
				content = `${userName}, did a **${abilityName}** check without a buff ${advantageDisadvantage !== 'no' ? 'and with ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${abilityName}** check with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff} ${rollOptions.buffDice},  ${advantageDisadvantage !== 'no' ? 'and ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
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
