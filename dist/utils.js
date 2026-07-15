import 'dotenv/config';
export async function DiscordRequest(endpoint, options) {
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
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    return res;
}
export async function InstallGlobalCommands(appId, commands) {
    const endpoint = `applications/${appId}/commands`;
    try {
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    }
    catch (err) {
        console.error(err);
    }
}
export function getRandomEmoji() {
    const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
    return emojiList[Math.floor(Math.random() * emojiList.length)];
}
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
