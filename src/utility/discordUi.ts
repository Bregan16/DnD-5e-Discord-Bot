import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	Message,
} from 'discord.js';

export const createBuffRows = (): {
    row1: ActionRowBuilder<ButtonBuilder>;
    row2: ActionRowBuilder<ButtonBuilder>;
    row3: ActionRowBuilder<ButtonBuilder>;
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

	const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(buff1d4, buff1, buff2, buff3, buff4);
	const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(deBuff1d4, deBuff1, deBuff2, deBuff3, deBuff4);
	const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(noBuff);

	return { row1, row2, row3 };
};

export const createAdvantageRow = (): ActionRowBuilder<ButtonBuilder> => {
	const noAdvantage = new ButtonBuilder().setCustomId('non').setLabel('Non').setStyle(ButtonStyle.Secondary);
	const buffAdvantage = new ButtonBuilder().setCustomId('advantage').setLabel('Advantage').setStyle(ButtonStyle.Success);
	const buffDisAdvantage = new ButtonBuilder().setCustomId('disadvantage').setLabel('Disadvantage').setStyle(ButtonStyle.Danger);

	return new ActionRowBuilder<ButtonBuilder>().addComponents(noAdvantage, buffAdvantage, buffDisAdvantage);
};

export const runTwoStepButtonPrompt = async (
	interaction: ChatInputCommandInteraction,
	firstPrompt: string,
	firstComponents: ActionRowBuilder<ButtonBuilder>[],
	secondPrompt: string,
	secondComponents: ActionRowBuilder<ButtonBuilder>[],
): Promise<{ firstChoice: ButtonInteraction; secondChoice: ButtonInteraction }> => {
	const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
	const initialMessage = await interaction.reply({
		content: firstPrompt,
		components: firstComponents,
		fetchReply: true,
	});

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

export const getBuffUIElements = async (
	name: string,
	interaction: ChatInputCommandInteraction,
): Promise<Message<boolean>> => {
	const { row1, row2, row3 } = createBuffRows();

	return await interaction.reply({
		content: `Select a buff for your "${name}" check!`,
		components: [row1, row2, row3],
		fetchReply: true,
	});
};

export const getAdvantageUIElements = async (
	name: string,
	interaction: ChatInputCommandInteraction,
): Promise<Message<boolean>> => {
	const row = createAdvantageRow();

	return await interaction.reply({
		content: `Now choose Advantage/Disadvantage for your "${name}" check!`,
		components: [row],
		fetchReply: true,
	});
};

