import { jest } from '@jest/globals';
import { APIEmbed, AttachmentBuilder, ChatInputCommandInteraction, Collection, MessageFlags } from 'discord.js';
import spellList from '../src/commands/players/spellList';

const createInteraction = (className: string | null, schoolName: string | null = null) => {
	const interaction = {
		client: {
			application: {
				commands: {
					cache: new Collection([['123456789012345678', { name: 'spell', id: '123456789012345678' }]]),
					fetch: jest.fn<() => Promise<Collection<string, { name: string; id: string }>>>(),
				},
			},
		},
		options: { getString: jest.fn((name: string) => name === 'class' ? className : schoolName) },
		reply: jest.fn<ChatInputCommandInteraction['reply']>(),
		deferReply: jest.fn<ChatInputCommandInteraction['deferReply']>(),
		editReply: jest.fn<ChatInputCommandInteraction['editReply']>(),
		followUp: jest.fn<ChatInputCommandInteraction['followUp']>(),
	};
	return {
		interaction,
		execute: () => spellList.execute(interaction as unknown as ChatInputCommandInteraction),
	};
};

const spell = (index: number) => ({
	name: `Spell ${index}`,
	index: `spell-${index}`,
	level: index % 10,
	school: { name: 'Evocation' },
});

describe('/spelllist', () => {
	afterEach(() => jest.restoreAllMocks());

	it('defines optional class and school options', () => {
		const command = spellList.data.toJSON();
		expect(command.name).toBe('spelllist');
		expect(command.options?.[0]).toMatchObject({ name: 'class', required: false });
		expect(command.options?.[1]).toMatchObject({ name: 'school', required: false });
	});

	it('normalizes the class and displays spell details in a private embed', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells: [spell(1), spell(0)] } })),
		);
		const { interaction, execute } = createInteraction('  WIZARD  ');
		await execute();

		expect(fetchMock).toHaveBeenCalledWith(
			'https://www.dnd5eapi.co/graphql/2024',
			expect.objectContaining({
				body: expect.stringContaining('"variables":{"classIndex":["wizard"],"skip":0'),
			}),
		);
		expect(interaction.deferReply).toHaveBeenCalledWith({ flags: MessageFlags.Ephemeral });
		const embed = interaction.editReply.mock.calls[0][0];
		expect(embed).toMatchObject({
			content: 'Use </spell:123456789012345678> and enter a spell name to view its details.',
			embeds: [{
				color: 0x0099ff,
				title: '__**Wizard Spell List**__',
				description: '## Cantrips\n**Spell 0** - Evocation (`spell-0`) - `/spell name:Spell 0`\n',
			}, expect.objectContaining({
				description: '## Level 1\n**Spell 1** - Evocation (`spell-1`) - `/spell name:Spell 1`\n',
			})],
		});
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it('fetches the registered command ID when it is not cached', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells: [spell(0)] } })),
		);
		const { interaction, execute } = createInteraction('wizard');
		const commands = interaction.client.application.commands;
		commands.cache.clear();
		commands.fetch.mockResolvedValue(new Collection([
			['987654321098765432', { name: 'spell', id: '987654321098765432' }],
		]));
		await execute();
		expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
			content: 'Use </spell:987654321098765432> and enter a spell name to view its details.',
		}));
	});

	it('keeps the spell list visible if the command shortcut cannot be resolved', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells: [spell(0)] } })),
		);
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
		const { interaction, execute } = createInteraction('wizard');
		const commands = interaction.client.application.commands;
		commands.cache.clear();
		commands.fetch.mockRejectedValue(new Error('Discord unavailable'));
		await execute();
		expect(errorLog).toHaveBeenCalled();
		expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
			content: 'Use `/spell` and enter a spell name to view its details.',
			embeds: [expect.objectContaining({ title: '__**Wizard Spell List**__' })],
		}));
	});

	it('normalizes the school and queries school instead of class', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells: [spell(0)] } })),
		);
		const { interaction, execute } = createInteraction(null, '  EVOCATION  ');
		await execute();

		expect(fetchMock).toHaveBeenCalledWith(
			'https://www.dnd5eapi.co/graphql/2024',
			expect.objectContaining({
				body: expect.stringContaining('"variables":{"schoolIndex":["evocation"],"skip":0'),
			}),
		);
		expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
			embeds: [expect.objectContaining({ title: '__**Evocation Spell List**__' })],
		}));
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it.each([
		[null, null],
		['wizard', 'evocation'],
	])('rejects missing or simultaneous filters (%s, %s)', async (className, schoolName) => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		const { interaction, execute } = createInteraction(className, schoolName);
		await execute();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({
			content: 'Provide either a class or a spell school, but not both.',
			flags: MessageFlags.Ephemeral,
		});
	});

	it('fetches all API pages and keeps every spell within Discord embed limits', async () => {
		const compactSpell = (index: number) => ({
			...spell(index), name: `S${index}`, index: `s${index}`, school: { name: 'E' },
		});
		const firstPage = Array.from({ length: 100 }, (_, index) => compactSpell(index));
		const fetchMock = jest.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(JSON.stringify({ data: { spells: firstPage } })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ data: { spells: [compactSpell(100)] } })));
		const { interaction, execute } = createInteraction('wizard');
		await execute();

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock.mock.calls[1][1]?.body).toContain('"skip":100');
		const message = interaction.editReply.mock.calls[0][0];
		if (typeof message !== 'object' || !message.embeds) throw new Error('Expected embeds');
		const embeds: APIEmbed[] = message.embeds.map(embed => 'toJSON' in embed ? embed.toJSON() : embed);
		expect(embeds[0].title).toBe('__**Wizard Spell List**__');
		expect(embeds.slice(1).every(embed => embed.title === undefined)).toBe(true);
		const descriptions = embeds.map(embed => embed.description);
		expect(embeds.reduce((total, embed) =>
			total + (embed.title?.length ?? 0) + (embed.description?.length ?? 0) + (embed.footer?.text.length ?? 0),
		0)).toBeLessThanOrEqual(6000);
		expect(descriptions.every(description => description && description.length <= 4096)).toBe(true);
		expect(descriptions).toHaveLength(10);
		descriptions.forEach((description, level) => {
			expect(description).toMatch(new RegExp(`^## ${level === 0 ? 'Cantrips' : `Level ${level}`}\\n`));
			expect(description?.match(/^## /gm)).toHaveLength(1);
		});
		const output = descriptions.join('');
		for (let index = 0; index <= 100; index++) {
			expect(output).toContain(`(\`s${index}\`)`);
			expect(output).toContain(`\`/spell name:S${index}\``);
		}
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it('repeats the level headline when a level needs multiple embeds', async () => {
		const spells = Array.from({ length: 30 }, (_, index) => ({
			...spell(index),
			name: `A very long spell name for checking pagination ${index}`,
			level: 3,
		}));
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells } })),
		);
		const { interaction, execute } = createInteraction('wizard');
		await execute();

		const message = interaction.editReply.mock.calls[0][0];
		if (typeof message !== 'object' || !message.embeds) throw new Error('Expected embeds');
		expect(message.embeds.length).toBeGreaterThan(1);
		for (const embed of message.embeds) {
			expect(embed).toMatchObject({ description: expect.stringMatching(/^## Level 3\n/) });
		}
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it('attaches the complete list in one reply when combined embeds exceed Discord limits', async () => {
		const spells = Array.from({ length: 90 }, (_, index) => ({
			...spell(index),
			name: `A very long spell name for checking the combined embed limit ${index}`,
		}));
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells } })),
		);
		const { interaction, execute } = createInteraction('wizard');
		await execute();

		const message = interaction.editReply.mock.calls[0][0];
		if (typeof message !== 'object' || !message.files) throw new Error('Expected attachment');
		const file = message.files[0];
		if (!(file instanceof AttachmentBuilder) || !Buffer.isBuffer(file.attachment)) {
			throw new Error('Expected text attachment');
		}
		const text = file.attachment.toString();
		for (let index = 0; index < spells.length; index++) {
			expect(text).toContain(`(\`spell-${index}\`)`);
			expect(text).toContain(`\`/spell name:${spells[index].name}\``);
		}
		expect(text).toContain('## Cantrips');
		expect(text).toContain('## Level 9');
		expect(message.embeds).toEqual([]);
		expect(message).toMatchObject({
			content: expect.stringContaining('</spell:123456789012345678>'),
		});
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it('reports empty results', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { spells: [] } })),
		);
		const { interaction, execute } = createInteraction('fighter');
		await execute();
		expect(interaction.editReply).toHaveBeenCalledWith({
			content: expect.stringContaining('No spells were found for class "fighter"'),
		});
	});

	it('reports API errors rather than displaying a partial list', async () => {
		jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network unavailable'));
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const { interaction, execute } = createInteraction('wizard');
		await execute();
		expect(interaction.editReply).toHaveBeenCalledWith({
			content: 'Spell lists are currently unavailable. Please try again later.',
		});
		expect(interaction.followUp).not.toHaveBeenCalled();
	});

	it('rejects invalid input without calling the API', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		const { interaction, execute } = createInteraction('  ');
		await execute();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({
			content: 'Enter a valid D&D class name.',
			flags: MessageFlags.Ephemeral,
		});
	});
});
