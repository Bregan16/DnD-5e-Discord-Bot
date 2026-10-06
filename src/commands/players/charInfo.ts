import {
	APIEmbedField,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	MessageFlags,
} from 'discord.js';
import { SLASH_COMMAND_LIST } from '../../utility/const';

const createField = (props: CreateFieldProps): APIEmbedField => {
	const {
		fieldName,
		fieldValues,
		isInline = true,
		valueFormatting = '`',
		keyFormatting = '__',
	} = props;
	return {
		name: `${keyFormatting}${fieldName}${keyFormatting}`,
		value: fieldValues.filter(kv => kv !== null).map(kv => `${kv.key}${kv.value ? ':' : ''} ${kv.value ? `${valueFormatting}${kv.value}${valueFormatting}` : ''}  
`).join(''),
		inline: isInline,
	};
};

const createEmbedFromCharacter = (character: CharacterEntry['character'] | undefined) => {
	const embed = {
		color: 0x0099ff,
		title: `__**${character?.basicInfo.name}**__ Level ${character?.basicInfo.level} ${character?.basicInfo.class}`,
		fields: [] as APIEmbedField[],
	};
	const proficiencyBonus = character?.basicInfo.proficiencyBonus ?? 0;
	const str = character?.abilityScores.strength.totalScore ?? 0;
	const dex = character?.abilityScores.dexterity.totalScore ?? 0;
	const dexMod = character?.abilityScores.dexterity.modifier ?? 0;
	const con = character?.abilityScores.constitution.totalScore ?? 0;
	const int = character?.abilityScores.intelligence.totalScore ?? 0;
	const wis = character?.abilityScores.wisdom.totalScore ?? 0;
	const cha = character?.abilityScores.charisma.totalScore ?? 0;

	embed.fields.push(createField({
		fieldName: 'Ability Scores',
		fieldValues: [
			{ key: '💪 St', value: str },
			{ key: '🖐 De', value: dex },
			{ key: '🕺 Co', value: con },
			{ key: '🧠 In', value: int },
			{ key: '👁️‍🗨️ Wi', value: wis },
			{ key: '💋 Ch', value: cha },
		],
		isInline: true,
	}));
	const strPro = character?.proficiencies.savingThrows.strength.isProficient ?? false;
	const dexPro = character?.proficiencies.savingThrows.dexterity.isProficient ?? false;
	const conPro = character?.proficiencies.savingThrows.constitution.isProficient ?? false;
	const intPro = character?.proficiencies.savingThrows.intelligence.isProficient ?? false;
	const wisPro = character?.proficiencies.savingThrows.wisdom.isProficient ?? false;
	const chaPro = character?.proficiencies.savingThrows.charisma.isProficient ?? false;
	embed.fields.push(createField({
		fieldName: 'Saving Throw',
		fieldValues: [
			{ key: '💪 St', value: `${str + (strPro ? proficiencyBonus : 0)}${(strPro ? '*' : '')}` },
			{ key: '🖐 De', value: `${dex + (dexPro ? proficiencyBonus : 0)}${(dexPro ? '*' : '')}` },
			{ key: '🕺 Co', value: `${con + (conPro ? proficiencyBonus : 0)}${(conPro ? '*' : '')}` },
			{ key: '🧠 In', value: `${int + (intPro ? proficiencyBonus : 0)}${(intPro ? '*' : '')}` },
			{ key: '👁️‍🗨️ Wi', value: `${wis + (wisPro ? proficiencyBonus : 0)}${(wisPro ? '*' : '')}` },
			{ key: '💋 Ch', value: `${cha + (chaPro ? proficiencyBonus : 0)}${(chaPro ? '*' : '')}` },
		],
		isInline: true,
	}));
	const maximumHP = character?.hitPoints.maximumHP ?? 0;
	const speed = character?.armorAndDefense.speed.value ?? 0;
	embed.fields.push(createField({
		fieldName: 'General stats',
		fieldValues: [
			{ key: 'Hitpoints', value: maximumHP },
			{ key: 'Speed', value: speed },
		],
		isInline: true,
	}));
	const armorClass = 10 + ((character?.armorAndDefense?.armor?.armorClassBonus ?? 0) + dexMod);
	const armor = character?.armorAndDefense.armor?.name ?? 'None';
	const shieldEntry = character?.armorAndDefense.shield;
	const shield = typeof shieldEntry === 'string' ? shieldEntry : shieldEntry?.name ?? 'None';
	const weapons = character?.weapons ?? [];

	embed.fields.push(createField({
		fieldName: 'Combat stats',
		fieldValues: [
			{ key: 'AC', value: armorClass },
			{ key: 'Armor', value: armor },
			{ key: 'Shield', value: shield },
			{ key: 'Weapons', value: weapons.map(weapon => weapon.name).join(', ') },
		],
		isInline: true,
	}));
	return [embed];
};

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.CHAR_INFO)
		.setDescription('Get character information!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Charakterinfo')),

	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		if (!interaction.isChatInputCommand()) return;
		if (interaction.commandName === SLASH_COMMAND_LIST.CHAR_INFO) {
			const subcommand = interaction.options.getSubcommand();
			const char = discordClient?.characters?.get(interaction.user.username)?.character;
			const embeds = createEmbedFromCharacter(char);
			try {
				const content = `The subcommand is **${subcommand}**`;
				await interaction.reply({
					content,
					embeds,
					flags: MessageFlags.Ephemeral,
				});
			}
			catch (error) {
				console.error('Error during confirmation:', error);
				await interaction.editReply({
					content: 'Confirmation not received within 1 minute, cancelling',
					components: [],
				});
			}
		}
	},
};
