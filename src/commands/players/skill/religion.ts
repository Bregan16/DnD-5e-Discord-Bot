import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import {getSkillEntry, getAbilityScoresEntry} from "../../../utility/chracterUtils";

export default {
    data: new SlashCommandBuilder().setName('religion').setDescription('Do a Religion check!'),
    async execute(
        interaction: ChatInputCommandInteraction,
        discordClient: DiscordClient,
    ) {
        const char = discordClient?.characters?.get(interaction.user.username)
        const skill = getSkillEntry(char?.character, 'Religion');
        const ability = getAbilityScoresEntry(char?.character, skill?.ability);
        console.log('## ', skill, ability );
        await interaction.reply(
            `${interaction.user.username}, will do a ${skill?.name} check using ${skill?.ability} with a base score of ${ability?.baseScore}!`,
        );
    },
};
