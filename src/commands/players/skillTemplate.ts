import {
	ChatInputCommandInteraction, ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { doSkillCheck, getDifficultyClass } from '../../utility/chracterUtils';
import { getBuffModal } from '../../utility/discordUi';

export default {
	data: new SlashCommandBuilder().setName('skilltemplate').setDescription('Do a skillTemplate check!'),

	async execute(interaction: ChatInputCommandInteraction, discordClient: DiscordClient) {
		const skillName = interaction.commandName;
		const modal = await getBuffModal(skillName);
		await interaction.showModal(modal);
	},

	async responds(interaction: ModalSubmitInteraction, discordClient: DiscordClient, options: any) {
		console.log('## responds', interaction.customId, interaction.fields);

		const diceBonusMalus = interaction.fields.getStringSelectValues('diceBonusMalus');
		const flatBonusMalus = interaction.fields.getStringSelectValues('flatBonusMalus');
		const advantageDisadvantage = interaction.fields.getRadioGroup('advantageDisadvantage');
		console.log(diceBonusMalus, flatBonusMalus, advantageDisadvantage);
		const rollOptions: SkillRollOptions = {
			buff: '',
			buffDice: '',
			advantage: 'no',
		};

		if (diceBonusMalus[0] !== undefined) {
			rollOptions.buff = diceBonusMalus[0];
		}

		if (flatBonusMalus[0] !== undefined) {
			rollOptions.buffDice = flatBonusMalus[0];
		}

		if (advantageDisadvantage && advantageDisadvantage !== 'no') {
			rollOptions.advantage = advantageDisadvantage as 'advantage' | 'disadvantage' | 'no';
		}

		const userName = interaction.user.username;
		const char = discordClient?.characters?.get(userName);
		const skillName = interaction.customId;
		const isDebuff = rollOptions.buff.startsWith('-');
		const rollResult = doSkillCheck(char?.character, skillName, rollOptions);

		console.log('## rollResult', diceBonusMalus.length, flatBonusMalus.length, advantageDisadvantage, rollResult.total);
		const difficultyClass = getDifficultyClass(rollResult.total);
		let content:string;
		if (diceBonusMalus.length === 0 && flatBonusMalus.length === 0) {
			content = `${userName}, did a **${skillName}** check without a buff ${advantageDisadvantage !== 'no' ? 'and with ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
		}
		else {
			content = `${userName}, did a **${skillName}** check with a ${isDebuff ? 'de' : ''}buff of ${rollOptions.buff} ${rollOptions.buffDice},  ${advantageDisadvantage !== 'no' ? 'and ' + advantageDisadvantage + ', ' : ''}the result is: ${rollResult.rendered} (DC: ${difficultyClass})`;
		}
		await interaction.reply({
			content,
			components: [],
		});

		if (interaction.customId === 'ping') {
		}
	},
};
