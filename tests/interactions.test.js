import request from 'supertest';
import { app } from '../app.js'; // Adjust path as necessary
import { InteractionType, InteractionResponseType } from 'discord-interactions';

describe('Discord Slash Commands', () => {
  /**
   * Test for Ping interaction
   */
  it('should respond with PONG for a PING interaction type', async () => {
    const response = await request(app)
      .post('/interactions')
      .send({
        type: InteractionType.PING,
        data: {},
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      type: InteractionResponseType.PONG,
    });
  });

  /**
   * Test for the "test" slash command
   */
  it('should return a message with an emoji for the "test" command', async () => {
    const response = await request(app)
      .post('/interactions')
      .send({
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'test',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
      // Verify the response contains components and includes "hello world"
      expect(response.body.data.components).toBeDefined();
      expect(response.body.data.components[0].content).toContain('hello world');
  });

  /**
   * Test for an unknown command name
   */
  it('should return 400 error for an unknown command name', async () => {
    const response = await request(app)
      .post('/interactions')
      .send({
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'unknown-command',
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('unknown command');
  });

  /**
   * Test for an unknown interaction type
   */
  it('should return 400 error for an unknown interaction type', async () => {
    const response = await request(app)
      .post('/interactions')
      .send({
        type: 'INVALID_TYPE',
        data: {},
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('unknown interaction type');
  });
});
