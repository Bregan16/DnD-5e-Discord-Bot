import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { getRPSChoices } from './game.js';
import { capitalize } from '../utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

const commandChoices = createCommandChoices().map((choice) => ({
  name: choice.name,
  value: choice.value,
}));

const ALL_COMMANDS = [
  new SlashCommandBuilder().setName('test').setDescription('Basic command'),
  new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Challenge to a match of rock paper scissors')
    .addStringOption((option) =>
      option
        .setName('object')
        .setDescription('Pick your object')
        .setRequired(true)
        .addChoices(...commandChoices),
    ),
  new SlashCommandBuilder()
    .setName('char_info')
    .setDescription('Get information about your character'),
].map((command) => command.toJSON());

const appId = process.env.APP_ID;
const token = process.env.DISCORD_TOKEN;

if (!appId) {
  throw new Error('APP_ID is required');
}

if (!token) {
  throw new Error('DISCORD_TOKEN is required');
}

const rest = new REST({ version: '10' }).setToken(token);
await rest.put(Routes.applicationCommands(appId), { body: ALL_COMMANDS });
console.log('Successfully registered application commands.');
