import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
} from 'discord.js';
import {doSkillChek, getSkillModifier} from "../../../utility/chracterUtils";
export default {
    data: new SlashCommandBuilder().setName('religion').setDescription('Do a Religion check!'),
    async execute(
        interaction: ChatInputCommandInteraction,
        discordClient: DiscordClient,
    ) {
        const skillName = interaction.commandName;
        const userName = interaction.user.username

        const char = discordClient?.characters?.get(userName);
        const rollResult = doSkillChek(char?.character, skillName);

        const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('No Buff').setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

        const response = await interaction.reply(
            {
                content: `${userName}, will do a ${skillName} check with the result of ${rollResult.total}!`,
                components: [row],
                withResponse: true,
        });

        const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
        try {
            const message = response.resource?.message;
            console.log('## confirmation', message );
            if (!message) {
                await interaction.editReply({ content: 'Confirmation message was not created', components: [] });
                return;
            }

            const confirmation = await message.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
                componentType: ComponentType.Button,
            });
            console.log('## ',  confirmation.customId);
            if (confirmation.customId === 'confirm') {
                await confirmation.update({ content: `has been banned for reason`, components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled', components: [] });
            }
        } catch {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};
