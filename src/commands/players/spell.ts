import {
	APIEmbedField,
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import GraphQLClient from '../../utility/graphQLClient';
import { SLASH_COMMAND_LIST } from '../../utility/const';

type Spell = {
	name: string;
	description: string;
	range: string;
	level: number;
	school: { name: string };
	higher_level: string | null;
	duration: string;
	ritual: boolean;
	material: string | null;
	attack_type: string | null;
	casting_time: string;
	concentration: boolean;
	damage: {
		damage_type: { description: string } | null;
		damage_at_slot_level: { value: string; level: number }[] | null;
		damage_at_character_level: { level: number; value: string }[] | null;
	} | null;
};

type SpellQueryResult = {
	spell: Spell | null;
};

const spellQuery = `
	query GetSpell($spellIndex2: String!) {
		spell(index: $spellIndex2) {
			name
			description
			range
			level
			school {
				name
			}
			higher_level
			duration
			ritual
			material
			attack_type
			casting_time
			concentration
			damage {
				damage_type {
					description
				}
				damage_at_slot_level {
					value
					level
				}
				damage_at_character_level {
					level
					value
				}
			}
		}
	}`;

const createSpellEmbed = (spell: Spell) => {
	const fields: APIEmbedField[] = [
		{ name: 'Level', value: spell.level === 0 ? 'Cantrip' : `${spell.level}`, inline: true },
		{ name: 'School', value: spell.school.name, inline: true },
		{ name: 'Casting Time', value: spell.casting_time, inline: true },
		{ name: 'Range', value: spell.range, inline: true },
		{ name: 'Duration', value: spell.duration, inline: true },
		{ name: 'Concentration', value: spell.concentration ? 'Yes' : 'No', inline: true },
		{ name: 'Ritual', value: spell.ritual ? 'Yes' : 'No', inline: true },
	];

	if (spell.material) {
		fields.push({ name: 'Material', value: spell.material, inline: false });
	}
	if (spell.attack_type) {
		fields.push({ name: 'Attack Type', value: spell.attack_type, inline: true });
	}
	if (spell.higher_level) {
		fields.push({ name: 'At Higher Levels', value: spell.higher_level, inline: false });
	}

	const damage = spell.damage;
	const damageEntries = [
		...(damage?.damage_at_slot_level ?? []).map(entry => `Level ${entry.level}: ${entry.value}`),
		...(damage?.damage_at_character_level ?? []).map(entry => `Level ${entry.level}: ${entry.value}`),
	];
	if (damageEntries.length || damage?.damage_type?.description) {
		fields.push({
			name: 'Damage',
			value: [
				...damageEntries,
				...(damage?.damage_type?.description ? [damage.damage_type.description] : []),
			].join('\n') || 'No damage details available.',
			inline: false,
		});
	}

	return {
		color: 0x0099ff,
		title: `__**${spell.name}**__`,
		description: spell.description,
		fields,
	};
};

const toSpellIndex = (spellName: string) => spellName
	.trim()
	.toLowerCase()
	.replace(/['’]/g, '')
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '');

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.SPELL)
		.setDescription('Look up a D&D 5e spell.')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The name of the spell to look up.')
				.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		const spellName = interaction.options.getString('name', true);
		const spellIndex = toSpellIndex(spellName);
		if (!spellIndex) {
			await interaction.reply({
				content: 'Enter a valid spell name.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		let spell: Spell | null;
		try {
			const result = await GraphQLClient<SpellQueryResult>(
				spellQuery,
				false,
				{ spellIndex2: spellIndex },
			);
			spell = result.spell;
		}
		catch (error) {
			console.error('Failed to fetch spell data:', error);
			await interaction.editReply({
				content: 'Spell information is currently unavailable. Please try again later.',
			});
			return;
		}

		if (!spell) {
			await interaction.editReply({
				content: `No spell named "${spellName}" was found.`,
			});
			return;
		}

		await interaction.editReply({
			embeds: [createSpellEmbed(spell)],
			content: '',
		});
	},
};
