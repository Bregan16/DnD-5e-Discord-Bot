import { jest } from '@jest/globals';
import { ChatInputCommandInteraction } from 'discord.js';
import spellCommand from '../src/commands/players/spell';

describe('/spell', () => {
	afterEach(() => jest.restoreAllMocks());

	it('requests and displays the spell school', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({
				data: {
					spell: {
						name: 'Fire Bolt',
						description: 'You hurl a mote of fire.',
						range: '120 feet',
						level: 0,
						school: { name: 'Evocation' },
						higher_level: null,
						duration: 'Instantaneous',
						ritual: false,
						material: null,
						attack_type: 'ranged',
						casting_time: 'Action',
						concentration: false,
						damage: null,
					},
				},
			})),
		);
		const interaction = {
			options: { getString: jest.fn().mockReturnValue('Fire Bolt') },
			deferReply: jest.fn<ChatInputCommandInteraction['deferReply']>(),
			editReply: jest.fn<ChatInputCommandInteraction['editReply']>(),
		};
		await spellCommand.execute(interaction as unknown as ChatInputCommandInteraction);

		const body = fetchMock.mock.calls[0][1]?.body;
		if (typeof body !== 'string') throw new Error('Expected GraphQL request body');
		expect(JSON.parse(body).query).toMatch(/school\s*{\s*name\s*}/);
		expect(interaction.editReply).toHaveBeenCalledWith({
			content: '',
			embeds: [expect.objectContaining({
				fields: expect.arrayContaining([
					{ name: 'School', value: 'Evocation', inline: true },
					{ name: 'Level', value: 'Cantrip', inline: true },
				]),
			})],
		});
	});
});
