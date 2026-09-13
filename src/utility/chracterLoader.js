import fs from 'node:fs';
import path from 'node:path';
import {
  Collection,
} from 'discord.js';

export default async function CharacterManager(discordClient, rootPath) {
    discordClient.characters = new Collection();

    const __dirname = path.dirname(rootPath);
    const foldersPath = path.join(__dirname, 'chars');
    const charsFiles = fs.readdirSync(foldersPath)
        .filter(file => file.endsWith('.json'));

	for (const file of charsFiles) {
        const data = fs.readFileSync(path.join(foldersPath, `${file}`));
        const parsedData = JSON.parse(data);
        discordClient.characters.set(parsedData.character.basicInfo.discoredId, parsedData);
	}
}
