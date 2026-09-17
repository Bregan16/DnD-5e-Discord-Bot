import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
    MessageFlags,
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

        // const noBuff = new ButtonBuilder().setCustomId('www0').setLabel('No Buff').setStyle(ButtonStyle.Secondary);
        // const buff1d4 = new ButtonBuilder().setCustomId('www+ 1d4').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        // const buff1 = new ButtonBuilder().setCustomId('www+ 1').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        // const buff2 = new ButtonBuilder().setCustomId('www+ 2').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        // const buff3 = new ButtonBuilder().setCustomId('www+ 3').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        // const buff4 = new ButtonBuilder().setCustomId('www+ 4').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        //
        // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        //     noBuff, buff1d4, buff1, buff2, buff3, buff4);

        const buff1d4 = new ButtonBuilder().setCustomId('+ 1d4').setLabel('+ 1d4').setStyle(ButtonStyle.Danger);
        const noBuff = new ButtonBuilder().setCustomId('noBuff').setLabel('No Buff').setStyle(ButtonStyle.Secondary);
        const buff1 = new ButtonBuilder().setCustomId('+ 1').setLabel('+ 1').setStyle(ButtonStyle.Danger);
        const buff2 = new ButtonBuilder().setCustomId('+ 2').setLabel('+ 2').setStyle(ButtonStyle.Danger);
        const buff3 = new ButtonBuilder().setCustomId('+ 3').setLabel('+ 3').setStyle(ButtonStyle.Danger);

        const deBuff1d4 = new ButtonBuilder().setCustomId('- 1d4').setLabel('- 1d4').setStyle(ButtonStyle.Danger);
        const noDeBuff = new ButtonBuilder().setCustomId('noDeBuff').setLabel('No Buff').setStyle(ButtonStyle.Secondary);
        const deBuff1 = new ButtonBuilder().setCustomId('- 1').setLabel('- 1').setStyle(ButtonStyle.Danger);
        const deBuff2 = new ButtonBuilder().setCustomId('- 2').setLabel('- 2').setStyle(ButtonStyle.Danger);
        const deBuff3 = new ButtonBuilder().setCustomId('- 3').setLabel('- 3').setStyle(ButtonStyle.Danger);

        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(noBuff, buff1d4, buff1, buff2, buff3);
        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(noDeBuff, deBuff1d4, deBuff1, deBuff2, deBuff3);

        const response = await interaction.reply(
            {
                content: `Select a buff for your "${skillName}" check!`,
                components: [row1, row2],
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
            const buff = confirmation.customId;
            const isDebuf = buff.startsWith('-');
            const rollOptions = {
                buff: '+ 0'
            };
            if (buff !== 'noBuff' && buff !== 'noDeBuff') {
                rollOptions.buff = buff;
            }

            const rollResult = doSkillChek(char?.character, skillName, rollOptions);
            if (confirmation.customId === 'noBuff' || confirmation.customId === 'noDeBuff') {
                await confirmation.update({ content: `${userName}, did a ${skillName} check without a buff, result is: ${rollResult.total}`, components: [] });
            } else {
                await confirmation.update({ content: `${userName}, did a ${skillName} check with a ${isDebuf?'de':''}buff of ${buff}, result is: ${rollResult.rendered}`, components: [] });
            }
        } catch {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};
