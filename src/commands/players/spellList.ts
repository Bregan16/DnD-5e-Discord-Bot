import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import GraphQLClient from '../../utility/graphQLClient';
import { SLASH_COMMAND_LIST } from '../../utility/const';

type ClassSpell = {
	name: string;
	index: string;
	level: number;
	school: { name: string };
};

type SpellListQueryResult = {
	spells: ClassSpell[];
};

const pageSize = 100;
const spellListQuery = `
	query GetClassSpells($spellsIndex: [String!]!, $skip: Int!, $limit: Int!) {
		spells(class: $spellsIndex, skip: $skip, limit: $limit) {
			name
			index
			level
			school {
				name
			}
		}
	}`;

const createSpellListEmbeds = (className: string, spells: ClassSpell[]) => {
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
		title: index === 0 ? `__**${className} Spell List**__` : undefined,
		description: text,
		footer: { text: `${spells.length} spells | Page ${index + 1}/${descriptions.length}` },
	}));
};

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.SPELL_LIST)
		.setDescription('Look up the D&D 5e spell list for a class.')
		.addStringOption(option =>
			option
				.setName('class')
				.setDescription('The class name, for example Wizard or Cleric.')
				.setMaxLength(100)
				.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		const className = interaction.options.getString('class', true).trim();
		const classIndex = className.toLowerCase().replace(/\s+/g, '-');
		if (!/^[a-z]+(?:-[a-z]+)*$/.test(classIndex)) {
			await interaction.reply({
				content: 'Enter a valid D&D class name.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const spells: ClassSpell[] = [];
		try {
			// The API returns at most 100 spells by default, so fetch every page.
			let page: ClassSpell[];
			do {
				const result = await GraphQLClient<SpellListQueryResult>(
					spellListQuery,
					false,
					{ spellsIndex: [classIndex], skip: spells.length, limit: pageSize },
				);
				page = result.spells;
				spells.push(...page);
			} while (page.length === pageSize);
		}
		catch (error) {
			console.error('Failed to fetch class spell list:', error);
			await interaction.editReply({
				content: 'Spell lists are currently unavailable. Please try again later.',
			});
			return;
		}

		if (!spells.length) {
			await interaction.editReply({
				content: `No spells were found for class "${className}". Check the class name; some classes have no spell list.`,
			});
			return;
		}

		const displayName = classIndex.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		const embeds = createSpellListEmbeds(displayName, spells);
		const totalLength = embeds.reduce(
			(total, embed) => total + (embed.title?.length ?? 0) + embed.description.length + embed.footer.text.length,
			0,
		);
		if (embeds.length > 10 || totalLength > 6000) {
			const text = `${displayName} Spell List\n\n${embeds.map(embed => embed.description).join('\n')}`;
			await interaction.editReply({
				content: 'This spell list exceeds Discord embed limits. The complete list, grouped by level, is attached.',
				embeds: [],
				files: [new AttachmentBuilder(Buffer.from(text), { name: `${classIndex}-spells.txt` })],
			});
			return;
		}
		await interaction.editReply({ embeds, content: '' });
	},
};
