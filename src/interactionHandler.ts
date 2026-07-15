import { getRandomEmoji } from './utils.js';

type CommandInteraction = {
  commandName: string;
  user: { id: string };
  reply: (options: string | { content: string; ephemeral: boolean }) => Promise<unknown>;
};

export async function handleCommandInteraction(interaction: CommandInteraction) {
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
