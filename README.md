# Getting Started app for Discord

https://duller-dispatch-henna.ngrok-free.dev/interactions

This project contains a basic rock-paper-scissors-style Discord bot built with `discord.js`.

![Demo of app](https://github.com/discord/discord-example-app/raw/main/assets/getting-started-demo.gif?raw=true)

## Project structure
Below is a basic overview of the project structure:

```
├── src
│   ├── examples    -> short, feature-specific sample apps
│   │   ├── app.js
│   │   ├── button.js
│   │   ├── command.js
│   │   ├── modal.js
│   │   ├── selectMenu.js
│   ├── app.ts      -> main entrypoint for bot client
│   ├── commands.js -> slash command payloads + helpers
│   ├── game.js     -> logic specific to RPS
│   └── interactionHandler.ts -> slash command response logic
├── dist         -> transpiled runtime output
├── tests        -> Jest tests
│   └── interactions.test.js
├── .env.sample -> sample .env file
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

## Running app locally

Before you start, you'll need to install [NodeJS](https://nodejs.org/en/download/) and [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages enabled)


Configuring the app is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

### Setup project

First clone the project:
```
git clone https://github.com/discord/discord-example-app.git
```

Then navigate to its directory and install dependencies:
```
cd discord-example-app
npm install
```
### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `.env.sample` for an example). You'll need your app ID (`APP_ID`) and bot token (`DISCORD_TOKEN`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).

### Install slash commands

The commands for the example app are set up in `commands.js`. All of the commands in the `ALL_COMMANDS` array at the bottom of `commands.js` will be installed when you run the `register` command configured in `package.json`:

```
npm run register
```

### Run the app

After your credentials are added, go ahead and run the app:

```
npm run dev
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.

If you aren't following the [getting started guide](https://discord.com/developers/docs/getting-started), you can move the contents of `examples/app.js` (the finished `app.js` file) to the top-level `app.js`.

### Invite and run the bot

This bot uses the Discord Gateway and does not need an Interactions Endpoint URL or ngrok tunnel.
After registering commands with `npm run register`, invite your bot with the `applications.commands` and `bot` scopes and run it with `npm run start`.

## Other resources
- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.
