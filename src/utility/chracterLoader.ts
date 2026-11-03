import fs from 'node:fs';
import path from 'node:path';
import {
	Collection,
} from 'discord.js';
import { GraphQLClient } from '../utility';
import { allCharactersQuery, completeCharacterDataQuery } from './constGraphQl';

export default async function CharacterManager(discordClient: DiscordClient, rootPath: string) {
	discordClient.characters = new Collection<string, CharacterEntry>();
	const allChars = await GraphQLClient(`
	  {
		  getAllCharacters 
		  ${allCharactersQuery}
		}
	`);
	console.log('## allChars', allChars );

	for (const char of allChars.getAllCharacters) {
		console.log('## ',  char.id);
		const charData = await GraphQLClient(`
		{
			getCharacter(id: "${char.id}") 
				${completeCharacterDataQuery}
		}
	  `);
		const parsedData = charData.getCharacter as CharacterEntry;
		parsedData.character.combatStats.turn = {
			action: false,
			bonusAction: false,
			advantage: false
		};
		discordClient.characters.set(parsedData.character.basicInfo.discordId, parsedData);
	}

	const __dirname = path.dirname(rootPath);
	const foldersPath = path.join(__dirname, 'chars');
	const charsFiles = fs.readdirSync(foldersPath)
		.filter(file => file.endsWith('.json'));

	for (const file of charsFiles) {
		const data = fs.readFileSync(path.join(foldersPath, `${file}`), 'utf8');
		const parsedData = JSON.parse(data) as CharacterEntry;
		parsedData.character.combatStats.turn = {
			action: false,
			bonusAction: false,
			advantage: false
		};
		// discordClient.characters.set(parsedData.character.basicInfo.discordId, parsedData);
		// console.log('## Load character:', parsedData.character.basicInfo)
	}
}
