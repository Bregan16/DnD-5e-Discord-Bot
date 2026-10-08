import {
	ChatInputCommandInteraction,
	MessageFlags, ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { doAttackRoll } from '../../utility/chracterUtils';
import {
	createBonusMaldsRespondsData,
	getBuffModal,
} from '../../utility/discordUi';
import {
	CUSTOM_COMMAND_SPLIT,
	MELEE_WEAPON_LIST,
	RANGED_WEAPON_LIST,
	SLASH_COMMAND_LIST,
} from '../../utility/const';

export default {
	data: new SlashCommandBuilder()
		.setName(SLASH_COMMAND_LIST.ATTACK)
		.setDescription('Roll a weapon attack.')
		.addStringOption(option =>
			option
				.setName('melee')
				.setDescription('The melee weapon to attack with.')
				.setRequired(false)
				.addChoices(...MELEE_WEAPON_LIST))
		.addStringOption(option =>
			option
				.setName('ranged')
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

		const meleeWeaponValue = interaction.options.getString('melee');
		const rangedWeaponValue = interaction.options.getString('ranged');
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
		const commandName = interaction.commandName;
		const modal = await getBuffModal(`${CUSTOM_COMMAND_SPLIT}${commandName}_${weapon.name}`);
		await interaction.showModal(modal);
	},

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient, options:RespondsOption) {
		try {
			console.log('## options', options);
			const {
				userName,
				isDebuff,
				rollOptions,
				diceBonusMalus,
				flatBonusMalus,
				advantageDisadvantage,
			} = createBonusMaldsRespondsData(interaction, options);

			const char = discordClient?.characters?.get(userName);
			const character = char?.character;
			const rollResult = doAttackRoll(character, options.weapon);

			let content = '';
			if (diceBonusMalus.length === 0 && flatBonusMalus.length === 0) {
				content = `${character?.basicInfo.name}, did an **attack** with a ${options.weapon} without a buff ${advantageDisadvantage !== 'no' ? 'and with ' + advantageDisadvantage + ', ' : ''}the result is: **${rollResult.rendered}**`;
			}
			else {
				content = `${character?.basicInfo.name}, did an **attack** with a ${options.weapon} with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff} ${rollOptions.buffDice},  ${advantageDisadvantage !== 'no' ? 'and ' + advantageDisadvantage + ', ' : ''}the result is: **${rollResult.rendered}**`;
			}

			await interaction.reply({
				content,
				components: [],
			});
		}
		catch (error) {
			console.error('Error during confirmation:', error);
			await interaction.editReply({
				content: 'Confirmation not received within 1 minute, cancelling',
				components: [],
			});
		}
	},
};
