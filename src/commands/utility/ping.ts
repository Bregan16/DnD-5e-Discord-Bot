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
		const modal = new ModalBuilder().setCustomId('myModal').setTitle('My Modal');

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			// Short means a single line of text.
			.setStyle(TextInputStyle.Short)
			// Placeholder text displayed inside the text input box
			.setPlaceholder('card games, films, books, etc.');

		const hobbiesLabel = new LabelBuilder()
			// The label is a large header text that identifies the interactive component for the user.
			.setLabel('What are some of your favorite hobbies?')
			// The description is an additional optional subtext that aids the label.
			.setDescription('Activities you like to participate in')
			// Set text input as the component of the label
			.setTextInputComponent(hobbiesInput);

		const input = new TextInputBuilder()
			// Set the component id (this is not the custom id)
			.setId(1)
			// Set the maximum number of characters allowed
			.setMaxLength(1_000)
			// Set the minimum number of characters required for submission
			.setMinLength(10)
			// Set a default value to prefill the text input
			.setValue('Default')
			// Require a value in this text input field (defaults to true)
			.setRequired(true);
		const favoriteStarterSelect = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			// Modal only property on select menus to prevent submission, defaults to true
			.setRequired(true)
			.addOptions(
				// String select menu options
				new StringSelectMenuOptionBuilder()
					// Label displayed to user
					.setLabel('Bulbasaur')
					// Description of option
					.setDescription('The dual-type Grass/Poison Seed Pokémon.')
					// Value returned to you in modal submission
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The Fire-type Lizard Pokémon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The Water-type Tiny Turtle Pokémon.')
					.setValue('squirtle'),
			);
		const favoriteStarterLabel = new LabelBuilder()
			.setLabel('Whats your favorite Gen 1 Pokémon starter?')
			// Set string select menu as component of the label
			.setStringSelectMenuComponent(favoriteStarterSelect);
		const text = new TextDisplayBuilder().setContent(
			'Text that could not fit in to a label or description\n-# Markdown can also be used',
		);
		modal.addLabelComponents(hobbiesLabel, favoriteStarterLabel)
			.addTextDisplayComponents(text);
		// Show modal to the user
		await interaction.showModal(modal);
	},
};
