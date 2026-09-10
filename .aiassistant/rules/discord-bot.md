---
apply: always
---

---
apply: always
---

# Project Rules

## Security & Environment
- **Sensitive Data**: Never hardcode `DISCORD_TOKEN`, `APP_ID`, or `PUBLIC_KEY` in the source code. Always use a `.env` file.
- **Environment Setup**: Ensure your local environment matches the project's requirements (Node.js >= 18.x).

## Code Structure & Organization
- **Game Logic**: All core game logic for Rock-Paper-Scissors must reside in `game.js`.
- **Utility Functions**: Helper functions and shared enums should be placed in `utils.js`.
- **Commands**: Slash command payloads and specific interaction handlers belong in `commands.js`.
- **Feature Examples**: Reference the `examples/` directory for isolated feature components (like buttons, modals, or select menus).

## Development Workflow
- **Command Registration**: Whenever you add or modify slash commands, run `npm run register` to sync them with the Discord API.
- **Local Interactions**: For local testing of interactive elements (buttons, modals), use a tunneling service like `ngrok`.
    - Ensure the connection is established on port `3010`.
    - Append `/interactions` to the forwarded URL when configuring it in the Discord Developer Portal.

## Standards
- **Package Management**: Use `npm` for managing dependencies and scripts.
- **Typing & Versioning**: Follow the project's Node version requirements as specified in `package.json`.
