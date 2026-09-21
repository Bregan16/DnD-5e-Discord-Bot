import {
	ChatInputCommandInteraction, ModalSubmitInteraction, LabelBuilder, ModalBuilder,
	SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
	TextDisplayBuilder, TextInputBuilder, TextInputStyle,
} from 'discord.js';
import { doSkillCheck, getDifficultyClass } from '../../utility/chracterUtils';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with a big Pong!'),

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient) {
		console.log('##', interaction.fields);

		if (interaction.customId === 'ping') {

			const diceBonusMalus = interaction.fields.getStringSelectValues('diceBonusMalus');
			const flatBonusMalus = interaction.fields.getStringSelectValues('flatBonusMalus');
			const advantageDisadvantage = interaction.fields.getRadioGroup('advantageDisadvantage');
			console.log(diceBonusMalus, flatBonusMalus, advantageDisadvantage);
			const rollOptions: SkillRollOptions = {
				buff: '',
			};

			if (diceBonusMalus[0] !== undefined) {
				rollOptions.buff = diceBonusMalus[0];
			}

			if (flatBonusMalus[0] !== undefined) {
				rollOptions.buffDice = flatBonusMalus[0];
			}

			if (advantageDisadvantage !== '') {
				rollOptions.advantage = advantageDisadvantage;
			}

			const userName = interaction.user.username;
			const char = discordClient?.characters?.get(userName);
			const skillName = 'acrobatics';
			const isDebuff = rollOptions.buff.startsWith('-');
			const rollResult = doSkillCheck(char?.character, skillName, rollOptions);

			console.log(rollResult);
			const difficultyClass = getDifficultyClass(rollResult.total);
			let content:string;
			if (diceBonusMalus[0] === '' && flatBonusMalus[0] === '') {
				content = `${userName}, did a **${skillName}** check without a buff ${advantageDisadvantage !== '' ? 'and with ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			else {
				content = `${userName}, did a **${skillName}** check with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff},  ${advantageDisadvantage !== 'non' ? 'and ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
			}
			await interaction.reply({
				content,
				components: [],
			});
		}
	},

	async execute(interaction: ChatInputCommandInteraction, discordClient: DiscordClient) {
		// await interaction.reply('Pong!');
		const modal = new ModalBuilder().setCustomId('ping').setTitle('Select your modifiers');

		const flatBonusMalus = new StringSelectMenuBuilder()
			.setCustomId('flatBonusMalus')
			.setPlaceholder('No flat bonus or malus')
			.setRequired(false)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('+1')
					.setValue('+1'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+2')
					.setValue('+2'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+3')
					.setValue('+3'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+4')
					.setValue('+4'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+5')
					.setValue('+5'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1')
					.setValue('-1'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-2')
					.setValue('-2'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-3')
					.setValue('-3'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-4')
					.setValue('-4'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-5')
					.setValue('-5'),
			);

		const diceBonusMalus = new StringSelectMenuBuilder()
			.setCustomId('diceBonusMalus')
			.setPlaceholder('No dice bonus or malus')
			.setRequired(false)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('+1d4')
					.setValue('+1d4'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+1d6')
					.setValue('+1d6'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+1d8')
					.setValue('+1d8'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+1d10')
					.setValue('+1d10'),
				new StringSelectMenuOptionBuilder()
					.setLabel('+1d12')
					.setValue('+1d12'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1d4')
					.setValue('-1d4'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1d6')
					.setValue('-1d6'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1d8')
					.setValue('-1d8'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1d10')
					.setValue('-1d10'),
				new StringSelectMenuOptionBuilder()
					.setLabel('-1d12')
					.setValue('-1d12'),
			);

		const bonusMalusSelect = new LabelBuilder()
			.setLabel('Select a flat bonus or malus')
			.setStringSelectMenuComponent(flatBonusMalus);

		const bonusMalusSelect2 = new LabelBuilder()
			.setLabel('Select a dice bonus or malus')
			.setStringSelectMenuComponent(diceBonusMalus);

		const diceBonusMalus_ = new LabelBuilder()
			.setLabel('Select a dice bonus/malus')
			.setRadioGroupComponent((radioGroup) =>
				radioGroup.setCustomId('diceBonusMalus').addOptions([
					{ label: '+ 1d4', value: '+1d4' },
					{ label: '- 1d4', value: '-1d4' },
					{ label: '+ 1d6', value: '+1d6' },
					{ label: '- 1d6', value: '-1d6' },
					{ label: '+ 1d8', value: '+1d8' },
					{ label: '- 1d8', value: '-1d8' },
					{ label: '+ 1d10', value: '+1d10' },
					{ label: '- 1d10', value: '-1d10' },
					{ label: '+ 1d12', value: '+1d12' },
					{ label: '- 1d12', value: '-1d12' },
				]).setRequired(false),
			);

		const advantageDisadvantage = new LabelBuilder()
			.setLabel('Select Advantage/Disadvantage')
			.setRadioGroupComponent((radioGroup) =>
				radioGroup.setCustomId('advantageDisadvantage').addOptions([
					{ label: 'no', value: 'no', default: true },
					{ label: 'Advantage', value: 'advantage' },
					{ label: 'Disadvantage', value: 'disadvantage' },
				]),
			);
		const text = new TextDisplayBuilder().setContent(
			'Text that could not fit in to a label or description\n-# Markdown can also be used',
		);

		modal.addLabelComponents(bonusMalusSelect, bonusMalusSelect2, advantageDisadvantage);

		await interaction.showModal(modal);
	},
};
