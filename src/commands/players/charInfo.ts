import {
	APIEmbedField,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	MessageFlags,
} from 'discord.js';
import { SLASH_COMMAND_LIST } from '../../utility/const';

type FieldValue = {
	key: string;
	value: string | number | undefined;
};

type CreateFieldProps = {
	fieldName: string;
	fieldValues: (FieldValue | null)[];
	isInline?: boolean;
	valueFormatting?: string;
	keyFormatting?: string;
};

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
		title: `__**${character?.basicInfo.name}**__`,
		fields: [] as APIEmbedField[],
	};
	embed.fields.push(createField({
		fieldName: 'Ability Scores',
		fieldValues: [
			{ key: '💪 St', value: character?.abilityScores.strength.totalScore },
			{ key: '🖐 De', value: character?.abilityScores.dexterity.totalScore },
			{ key: '🕺 Co', value: character?.abilityScores.constitution.totalScore },
			{ key: '🧠 In', value: character?.abilityScores.intelligence.totalScore },
			{ key: '👁️‍🗨️ Wi', value: character?.abilityScores.wisdom.totalScore },
			{ key: '💋 Ch', value: character?.abilityScores.charisma.totalScore },
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
			console.log(subcommand, interaction);
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
