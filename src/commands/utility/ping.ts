import {
	ChatInputCommandInteraction, LabelBuilder, ModalBuilder,
	SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
	TextDisplayBuilder, TextInputBuilder, TextInputStyle,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with a big Pong!'),
	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		// await interaction.reply('Pong!');
		const modal = new ModalBuilder().setCustomId('myModal').setTitle('Select your modifiers');

		const bonusMalus = new StringSelectMenuBuilder()
			.setCustomId('bonusMalus')
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

		const bonusMalus2 = new StringSelectMenuBuilder()
			.setCustomId('bonusMalus2')
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
			.setStringSelectMenuComponent(bonusMalus);

		const bonusMalusSelect2 = new LabelBuilder()
			.setLabel('Select a dice bonus or malus')
			.setStringSelectMenuComponent(bonusMalus2);

		const diceBonusMalus = new LabelBuilder()
			.setLabel('Select a dice bonus/malus')
			.setRadioGroupComponent((radioGroup) =>
			radioGroup.setCustomId('diceBonusMalus').addOptions([
				{ label: '+ 1d4', value: '+1d4'},
				{ label: '- 1d4', value: '-1d4'},
				{ label: '+ 1d6', value: '+1d6'},
				{ label: '- 1d6', value: '-1d6'},
				{ label: '+ 1d8', value: '+1d8'},
				{ label: '- 1d8', value: '-1d8'},
				{ label: '+ 1d10', value: '+1d10'},
				{ label: '- 1d10', value: '-1d10'},
				{ label: '+ 1d12', value: '+1d12'},
				{ label: '- 1d12', value: '-1d12'},
			]).setRequired(false),
		);

		const advantageDisadvantage = new LabelBuilder()
			.setLabel('Select Advantage/Disadvantage')
			.setRadioGroupComponent((radioGroup) =>
			radioGroup.setCustomId('advantageDisadvantage').addOptions([
				{ label: 'no', value: 'no', default: true},
				{ label: 'Advantage', value: 'advantage'},
				{ label: 'Disadvantage', value: 'disadvantage'},
			])
		);
		const text = new TextDisplayBuilder().setContent(
			'Text that could not fit in to a label or description\n-# Markdown can also be used',
		);

		modal.addLabelComponents(bonusMalusSelect, bonusMalusSelect2, advantageDisadvantage);

		// Show modal to the user
		await interaction.showModal(modal);
	},
};
