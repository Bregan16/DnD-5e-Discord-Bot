import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	MessageFlags,
	LabelBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';
import { ABILITIES_LIST } from './const';
import { doSavingThrowCheck} from './chracterUtils';

export  const createAbilityModal = async (interaction: ChatInputCommandInteraction) => {
	const skillName = interaction.commandName;
	const { actionFirstRow, actionSecondRow } = createAbilityRow();
	const { firstChoice } = await runOneStepButtonPrompt(
		interaction,
		`Select the ability for your ${skillName}!`,
		[actionFirstRow, actionSecondRow],
	);
	console.log('## firstChoice', interaction.commandName, firstChoice.customId );
	const modal = await getBuffModal(`splitt_command_${skillName}_${firstChoice.customId}`);
	await firstChoice.showModal(modal);
	await interaction.deleteReply();
}

export const createBonusMaldsRepondsData = (interaction: ModalSubmitInteraction, discordClient: DiscordClient, options: any) => {
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
	const userName = interaction.user.username;
	const name = options.ability !== '' ? options.ability : options.skill;
	const isDebuff = rollOptions.buff.startsWith('-');
	const char = discordClient?.characters?.get(userName);
	const rollResult = doSavingThrowCheck(char?.character, name, rollOptions);

	return { rollResult, userName, name, isDebuff, rollOptions, diceBonusMalus, flatBonusMalus, advantageDisadvantage };
}

export const createAbilityRow = (): { actionFirstRow: ActionRowBuilder<ButtonBuilder>; actionSecondRow: ActionRowBuilder<ButtonBuilder> } => {
	const actionFirstRow = new ActionRowBuilder<ButtonBuilder>();
	const actionSecondRow = new ActionRowBuilder<ButtonBuilder>();
	ABILITIES_LIST.forEach((ability, index) => {
		const buffAbility = new ButtonBuilder().setCustomId(ability).setLabel(ability).setStyle(ButtonStyle.Success);
		if (index < 3) {
			actionFirstRow.addComponents(buffAbility);
		} else {
			actionSecondRow.addComponents(buffAbility);
		}
	});
	return { actionFirstRow, actionSecondRow };
};

export const runOneStepButtonPrompt = async (
	interaction: ChatInputCommandInteraction,
	prompt: string,
	components: ActionRowBuilder<ButtonBuilder>[],
): Promise<{ firstChoice: ButtonInteraction }> => {
	const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
	const initialResponse = await interaction.reply({
		content: prompt,
		components,
		withResponse: true,
		flags: MessageFlags.Ephemeral,
	});
	const initialMessage = initialResponse.resource?.message;
	if (!initialMessage) {
		throw new Error('Initial interaction response message was not created');
	}

	const firstChoice = await initialMessage.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	return { firstChoice };
};

export const getBuffModal = async (
	customId: string,
): Promise<ModalBuilder> => {
	const modal: ModalBuilder = new ModalBuilder().setCustomId(customId).setTitle('Select your modifiers');

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

	const diceBonusMalusSelect2 = new LabelBuilder()
		.setLabel('Select a dice bonus or malus')
		.setStringSelectMenuComponent(diceBonusMalus);

	const advantageDisadvantage = new LabelBuilder()
		.setLabel('Select Advantage/Disadvantage')
		.setRadioGroupComponent((radioGroup) =>
			radioGroup.setCustomId('advantageDisadvantage').addOptions([
				{ label: 'no', value: 'no', default: true },
				{ label: 'Advantage', value: 'advantage' },
				{ label: 'Disadvantage', value: 'disadvantage' },
			]),
		);

	modal.addLabelComponents(bonusMalusSelect, diceBonusMalusSelect2, advantageDisadvantage);

	return modal;
};

/* Archive */

export const runTwoStepButtonPrompt = async (
	interaction: ChatInputCommandInteraction,
	firstPrompt: string,
	firstComponents: ActionRowBuilder<ButtonBuilder>[],
	secondPrompt: string,
	secondComponents: ActionRowBuilder<ButtonBuilder>[],
): Promise<{ firstChoice: ButtonInteraction; secondChoice: ButtonInteraction }> => {
	const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
	const initialResponse = await interaction.reply({
		content: firstPrompt,
		components: firstComponents,
		withResponse: true,
		flags: MessageFlags.Ephemeral,
	});
	const initialMessage = initialResponse.resource?.message;
	if (!initialMessage) {
		throw new Error('Initial interaction response message was not created');
	}

	const firstChoice = await initialMessage.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	await firstChoice.update({
		content: secondPrompt,
		components: secondComponents,
	});

	const secondChoice = await firstChoice.message.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	return { firstChoice, secondChoice };
};

export const createBuffRows = (): {
	buffRow: ActionRowBuilder<ButtonBuilder>;
	deBuffRow: ActionRowBuilder<ButtonBuilder>;
	noBuffRow: ActionRowBuilder<ButtonBuilder>;
} => {
	const buff1d4 = new ButtonBuilder().setCustomId('+ 1d4').setLabel('+ 1d4').setStyle(ButtonStyle.Success);
	const buff1 = new ButtonBuilder().setCustomId('+ 1').setLabel('+ 1').setStyle(ButtonStyle.Success);
	const buff2 = new ButtonBuilder().setCustomId('+ 2').setLabel('+ 2').setStyle(ButtonStyle.Success);
	const buff3 = new ButtonBuilder().setCustomId('+ 3').setLabel('+ 3').setStyle(ButtonStyle.Success);
	const buff4 = new ButtonBuilder().setCustomId('+ 4').setLabel('+ 4').setStyle(ButtonStyle.Success);

	const deBuff1d4 = new ButtonBuilder().setCustomId('- 1d4').setLabel('- 1d4').setStyle(ButtonStyle.Danger);
	const deBuff1 = new ButtonBuilder().setCustomId('- 1').setLabel('- 1').setStyle(ButtonStyle.Danger);
	const deBuff2 = new ButtonBuilder().setCustomId('- 2').setLabel('- 2').setStyle(ButtonStyle.Danger);
	const deBuff3 = new ButtonBuilder().setCustomId('- 3').setLabel('- 3').setStyle(ButtonStyle.Danger);
	const deBuff4 = new ButtonBuilder().setCustomId('- 4').setLabel('- 4').setStyle(ButtonStyle.Danger);

	const noBuff = new ButtonBuilder().setCustomId('noBuff').setLabel('No Buff').setStyle(ButtonStyle.Secondary);

	const buffRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buff1d4, buff1, buff2, buff3, buff4);
	const deBuffRow = new ActionRowBuilder<ButtonBuilder>().addComponents(deBuff1d4, deBuff1, deBuff2, deBuff3, deBuff4);
	const noBuffRow = new ActionRowBuilder<ButtonBuilder>().addComponents(noBuff);

	return { buffRow, deBuffRow, noBuffRow };
};

export const createAdvantageRow = (): ActionRowBuilder<ButtonBuilder> => {
	const noAdvantage = new ButtonBuilder().setCustomId('no').setLabel('no').setStyle(ButtonStyle.Secondary);
	const buffAdvantage = new ButtonBuilder().setCustomId('advantage').setLabel('Advantage').setStyle(ButtonStyle.Success);
	const buffDisAdvantage = new ButtonBuilder().setCustomId('disadvantage').setLabel('Disadvantage').setStyle(ButtonStyle.Danger);

	return new ActionRowBuilder<ButtonBuilder>().addComponents(noAdvantage, buffAdvantage, buffDisAdvantage);
};

export const runThreeStepButtonPrompt = async (
	interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
	firstPrompt: string,
	firstComponents: ActionRowBuilder<ButtonBuilder>[],
	secondPrompt: string,
	secondComponents: ActionRowBuilder<ButtonBuilder>[],
	thirdPrompt: string,
	thirdComponents: ActionRowBuilder<ButtonBuilder>[],
): Promise<{ firstChoice: ButtonInteraction; secondChoice: ButtonInteraction; thirdChoice: ButtonInteraction }> => {
	const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
	const initialResponse = await interaction.reply({
		content: firstPrompt,
		components: firstComponents,
		withResponse: true,
	});
	const initialMessage = initialResponse.resource?.message;
	if (!initialMessage) {
		throw new Error('Initial interaction response message was not created');
	}

	const firstChoice = await initialMessage.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	await firstChoice.update({
		content: secondPrompt,
		components: secondComponents,
	});

	const secondChoice = await firstChoice.message.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	await secondChoice.update({
		content: thirdPrompt,
		components: thirdComponents,
	});

	const thirdChoice = await secondChoice.message.awaitMessageComponent({
		filter: collectorFilter,
		time: 60_000,
		componentType: ComponentType.Button,
	});

	return { firstChoice, secondChoice, thirdChoice };
};
