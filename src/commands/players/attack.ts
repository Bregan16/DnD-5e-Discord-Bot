import {
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { doAttackRoll } from '../../utility/chracterUtils';
import {
	MELEE_WEAPON_LIST,
	RANGED_WEAPON_LIST,
	SLASH_COMMAND_LIST,
} from '../../utility/const';

const KSF_CHOICES = [
	{ name: 'Wuchtschlag', value: 'wuchtschlag' },
	{ name: 'Finte', value: 'finte' },
	{ name: 'Sturmangriff', value: 'sturmangriff' },
	{ name: 'Todesstoß', value: 'todesstoß' },
	{ name: 'Vorstoß', value: 'vorstoß' },
	{ name: 'Entwaffnen', value: 'entwaffnen' },
	{ name: 'Zu Fall bringen', value: 'zufallbringen' },
	{ name: 'Beidhändiger Kampf', value: 'bk' },
];

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.ATTACK)
		.setDescription('Roll a weapon attack.')
		.addStringOption(option =>
			option
				.setName('melee-weapon')
				.setDescription('The melee weapon to attack with.')
				.setRequired(false)
				.addChoices(...MELEE_WEAPON_LIST))
		.addStringOption(option =>
			option
				.setName('ranged-weapon')
				.setDescription('The ranged weapon to attack with.')
				.setRequired(false)
				.addChoices(...RANGED_WEAPON_LIST)),

	async execute(
		interaction: ChatInputCommandInteraction,
		discordClient: DiscordClient,
	) {
		const character = discordClient.characters
			.get(interaction.user.username)?.character;
		if (!character) {
			await interaction.reply({
				content: 'No character found for your Discord account.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const meleeWeaponValue = interaction.options.getString('melee-weapon');
		const rangedWeaponValue = interaction.options.getString('ranged-weapon');
		if (Boolean(meleeWeaponValue) === Boolean(rangedWeaponValue)) {
			await interaction.reply({
				content: 'Choose exactly one melee or ranged weapon.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const weaponChoice = [...MELEE_WEAPON_LIST, ...RANGED_WEAPON_LIST]
			.find(({ value }) => value === (meleeWeaponValue ?? rangedWeaponValue));
		if (!weaponChoice) {
			await interaction.reply({
				content: 'The selected weapon is not recognized.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const weapon = character.weapons.find(
			entry => entry.name.toLocaleLowerCase() === weaponChoice.name.toLocaleLowerCase(),
		);
		if (!weapon) {
			await interaction.reply({
				content: `You don't have a ${weaponChoice.name}.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const result = doAttackRoll(character, weapon);
		await interaction.reply({
			content: `${character.basicInfo.name} attacks with ${weapon.name}: **${result.rendered}**`,
		});
	},
};
