import { roll } from 'roll-parser';
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
} from 'discord.js';
import { getSkillModifier } from "../../../utility/chracterUtils";

export default {
    data: new SlashCommandBuilder().setName('religion').setDescription('Do a Religion check!'),
    async execute(
        interaction: ChatInputCommandInteraction,
        discordClient: DiscordClient,
    ) {
        const skillName = 'Religion';
        const char = discordClient?.characters?.get(interaction.user.username)
        const ability = getSkillModifier(char?.character, skillName);

        const rollResult = roll(`1d20 + ${ability}`);

        await interaction.reply(
            {
                content: `${interaction.user.username}, will do a ${skillName} check with the result of ${rollResult.total}!`,
                flags: MessageFlags.Ephemeral },
        );
    },
};
