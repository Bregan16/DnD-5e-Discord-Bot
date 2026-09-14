import fs from 'node:fs';
import path from 'node:path';
import {
  Collection,
} from 'discord.js';

export default async function CharacterManager(discordClient: DiscordClient, rootPath: string) {
    discordClient.characters = new Collection<string, CharacterEntry>();

    const __dirname = path.dirname(rootPath);
    const foldersPath = path.join(__dirname, 'chars');
    const charsFiles = fs.readdirSync(foldersPath)
        .filter(file => file.endsWith('.json'));

	for (const file of charsFiles) {
        const data = fs.readFileSync(path.join(foldersPath, `${file}`), 'utf8');
        const parsedData = JSON.parse(data) as CharacterEntry;
        discordClient.characters.set(parsedData.character.basicInfo.discoredId, parsedData);
	}
}
