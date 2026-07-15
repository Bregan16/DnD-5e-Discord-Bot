import { getRandomEmoji } from './utils.js';
export async function handleCommandInteraction(interaction) {
    if (interaction.commandName === 'test') {
        await interaction.reply(`hello world ${getRandomEmoji()}!`);
        return;
    }
    if (interaction.commandName === 'char_info') {
        await interaction.reply(`Hello World\nYour User ID: ${interaction.user.id}`);
        return;
    }
    console.error(`unknown command: ${interaction.commandName}`);
    await interaction.reply({
        content: 'Unknown command',
        ephemeral: true,
    });
}
