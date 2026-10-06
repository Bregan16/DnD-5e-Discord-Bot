export default async function CombatUtility(discordClient: DiscordClient) {
    discordClient.combat = {
        initiativeOrder: [],
        currentTurnIndex: 0,
        addCharacterToInitiative: function(character: CharacterEntry['character'], initiative: number) {
            this.initiativeOrder = this.initiativeOrder.filter(c => c.discordId !== character.basicInfo.discordId);
            this.initiativeOrder.push({
                discordId: character.basicInfo.discordId,
                name: character.basicInfo.name,
                initiative: initiative,
            });
            this.initiativeOrder.sort((a, b) => b.initiative - a.initiative);
        },
        removeCharacterFromInitiative: function(characterId: string) {
            const removedIndex = this.initiativeOrder.findIndex(c => c.discordId === characterId);
            if (removedIndex === -1) return false;

            this.initiativeOrder = this.initiativeOrder.filter(c => c.discordId !== characterId);
            if (removedIndex < this.currentTurnIndex) {
                this.currentTurnIndex -= 1;
            }
            if (this.currentTurnIndex >= this.initiativeOrder.length) {
                this.currentTurnIndex = 0;
            }
            return true;
        },
        showInitiativeOrder: function() {
            return this.initiativeOrder.map((c, index) => `${index + 1}. ${c.name} (Initiative: ${c.initiative})`).join('\n');
        },
        clearInitiativeOrder: function() {
            this.initiativeOrder = [];
            this.currentTurnIndex = 0;
        }
    }
}