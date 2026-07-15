import { jest } from '@jest/globals';
import { handleCommandInteraction } from '../dist/interactionHandler.js';

describe('Discord Slash Commands', () => {
  function createInteraction(commandName, userId = '1234567890') {
    return {
      commandName,
      user: { id: userId },
      reply: jest.fn().mockResolvedValue(undefined),
    };
  }

  it('replies to the "test" command', async () => {
    const interaction = createInteraction('test');
    await handleCommandInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith(expect.stringContaining('hello world'));
  });

  it('replies to the "char_info" command with user id', async () => {
    const interaction = createInteraction('char_info', '42');
    await handleCommandInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith('Hello World\nYour User ID: 42');
  });

  it('replies with an ephemeral error for unknown commands', async () => {
    const interaction = createInteraction('unknown-command');
    await handleCommandInteraction(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Unknown command',
      ephemeral: true,
    });
  });
});
