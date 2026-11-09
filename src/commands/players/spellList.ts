import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import GraphQLClient from '../../utility/graphQLClient';
import { SLASH_COMMAND_LIST } from '../../utility/const';

type ListSpell = {
	name: string;
	index: string;
	level: number;
	school: { name: string };
};

type SpellListQueryResult = {
	spells: ListSpell[];
};

const pageSize = 100;
const spellListQuery = `
	query GetSpells($classIndex: [String!], $schoolIndex: [String!], $skip: Int!, $limit: Int!) {
		spells(class: $classIndex, school: $schoolIndex, skip: $skip, limit: $limit) {
			name
			index
			level
			school {
				name
			}
		}
	}`;

const createSpellListEmbeds = (displayName: string, spells: ListSpell[]) => {
	const descriptions: string[] = [];
	let description = '';
	let currentLevel: number | undefined;
	for (const spell of [...spells].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))) {
		const heading = `## ${spell.level === 0 ? 'Cantrips' : `Level ${spell.level}`}\n`;
		const line = `**${spell.name}** - ${spell.school.name} (\`${spell.index}\`)\n`;
		if (currentLevel !== spell.level || description.length + line.length > 3800) {
			if (description) descriptions.push(description);
			description = heading;
			currentLevel = spell.level;
		}
		description += line;
	}
	if (description) descriptions.push(description);

	return descriptions.map((text, index) => ({
		color: 0x0099ff,
		title: index === 0 ? `__**${displayName} Spell List**__` : undefined,
		description: text,
		footer: { text: `${spells.length} spells | Page ${index + 1}/${descriptions.length}` },
	}));
};

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.SPELL_LIST)
		.setDescription('Look up D&D 5e spells by class or spell school.')
		.addStringOption(option =>
			option
				.setName('class')
				.setDescription('The class name, for example Wizard or Cleric.')
				.setMaxLength(100)
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('school')
				.setDescription('The spell school, for example Evocation or Abjuration.')
				.setMaxLength(100)
				.setRequired(false)),

	async execute(interaction: ChatInputCommandInteraction) {
		const className = interaction.options.getString('class');
		const schoolName = interaction.options.getString('school');
		if ((className === null) === (schoolName === null)) {
			await interaction.reply({
				content: 'Provide either a class or a spell school, but not both.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const filterType = className !== null ? 'class' : 'school';
		const filterName = (className ?? schoolName ?? '').trim();
		const filterIndex = filterName.toLowerCase().replace(/\s+/g, '-');
		if (!/^[a-z]+(?:-[a-z]+)*$/.test(filterIndex)) {
			await interaction.reply({
				content: `Enter a valid D&D ${filterType} name.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const spells: ListSpell[] = [];
		try {
			// The API returns at most 100 spells by default, so fetch every page.
			let page: ListSpell[];
			do {
				const result = await GraphQLClient<SpellListQueryResult>(
					spellListQuery,
					false,
					{
						...(filterType === 'class'
							? { classIndex: [filterIndex] }
							: { schoolIndex: [filterIndex] }),
						skip: spells.length,
						limit: pageSize,
					},
				);
				page = result.spells;
				spells.push(...page);
			} while (page.length === pageSize);
		}
		catch (error) {
			console.error('Failed to fetch spell list:', error);
			await interaction.editReply({
				content: 'Spell lists are currently unavailable. Please try again later.',
			});
			return;
		}

		if (!spells.length) {
			await interaction.editReply({
				content: `No spells were found for ${filterType} "${filterName}". Check the ${filterType} name.`,
			});
			return;
		}

		const displayName = filterIndex.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		let spellShortcut = '`/spell`';
		try {
			const commands = interaction.client.application.commands;
			const spellCommand = commands.cache.find(command => command.name === SLASH_COMMAND_LIST.SPELL)
				?? (await commands.fetch()).find(command => command.name === SLASH_COMMAND_LIST.SPELL);
			if (!spellCommand) {
				throw new Error('The /spell command is not registered');
			}
			spellShortcut = `</${SLASH_COMMAND_LIST.SPELL}:${spellCommand.id}>`;
		}
		catch (error) {
			console.error('Failed to resolve /spell command mention:', error);
		}
		const instructions = `Use ${spellShortcut} and enter a spell name to view its details.`;
		const embeds = createSpellListEmbeds(displayName, spells);
		const totalLength = embeds.reduce(
			(total, embed) => total + (embed.title?.length ?? 0) + embed.description.length + embed.footer.text.length,
			0,
		);
		if (embeds.length > 10 || totalLength > 6000) {
			const text = `${displayName} Spell List\n\n${embeds.map(embed => embed.description).join('\n')}`;
			await interaction.editReply({
				content: `${instructions}\nThis spell list exceeds Discord embed limits. The complete list, grouped by level, is attached.`,
				embeds: [],
				files: [new AttachmentBuilder(Buffer.from(text), { name: `${filterIndex}-spells.txt` })],
			});
			return;
		}
		await interaction.editReply({ embeds, content: instructions });
	},
};
