import 'dotenv/config';

type DiscordRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function DiscordRequest(
  endpoint: string,
  options: DiscordRequestOptions,
): Promise<Response> {
  const url = 'https://discord.com/api/v10/' + endpoint;
  const { body, ...rest } = options;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...rest,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const data: unknown = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export async function InstallGlobalCommands(
  appId: string | undefined,
  commands: unknown[],
): Promise<void> {
  const endpoint = `applications/${appId}/commands`;
  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export function getRandomEmoji(): string {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
