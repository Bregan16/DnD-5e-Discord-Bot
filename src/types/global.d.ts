import { Client, Collection } from 'discord.js';

declare global {
  interface CharacterEntry {
    character: {
      basicInfo: {
        name: string;
        discoredId: string;
      };
    };
  }

  type DiscordCommand = {
    data: { name: string };
    execute: (interaction: import('discord.js').ChatInputCommandInteraction, discordClient: DiscordClient) => Promise<void>;
  };

  type DiscordClient = Client<boolean> & {
    commands: Collection<string, DiscordCommand>;
    characters: Collection<string, CharacterEntry>;
  };
}

export {};
