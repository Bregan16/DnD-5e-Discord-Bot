import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	Message,
} from 'discord.js';
import { ABILITIES_LIST } from './const';

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
	const noAdvantage = new ButtonBuilder().setCustomId('non').setLabel('Non').setStyle(ButtonStyle.Secondary);
	const buffAdvantage = new ButtonBuilder().setCustomId('advantage').setLabel('Advantage').setStyle(ButtonStyle.Success);
	const buffDisAdvantage = new ButtonBuilder().setCustomId('disadvantage').setLabel('Disadvantage').setStyle(ButtonStyle.Danger);

	return new ActionRowBuilder<ButtonBuilder>().addComponents(noAdvantage, buffAdvantage, buffDisAdvantage);
};

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

export const runThreeStepButtonPrompt = async (
	interaction: ChatInputCommandInteraction,
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

export const getBuffUIElements = async (
	name: string,
	interaction: ChatInputCommandInteraction,
): Promise<Message<boolean>> => {
	const { buffRow, deBuffRow, noBuffRow } = createBuffRows();

	const response = await interaction.reply({
		content: `Select a buff for your "${name}" check!`,
		components: [buffRow, deBuffRow, noBuffRow],
		withResponse: true,
	});
	const message = response.resource?.message;
	if (!message) {
		throw new Error('Buff interaction response message was not created');
	}

	return message;
};

export const getAdvantageUIElements = async (
	name: string,
	interaction: ChatInputCommandInteraction,
): Promise<Message<boolean>> => {
	const row = createAdvantageRow();

	const response = await interaction.reply({
		content: `Now choose Advantage/Disadvantage for your "${name}" check!`,
		components: [row],
		withResponse: true,
	});
	const message = response.resource?.message;
	if (!message) {
		throw new Error('Advantage interaction response message was not created');
	}

	return message;
};
