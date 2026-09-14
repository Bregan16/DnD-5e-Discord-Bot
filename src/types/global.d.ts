import { Client, Collection } from 'discord.js';

declare global {
  interface CharacterEntry {
    character: {
      basicInfo: {
        discoredId: string;
        name: string;
        class: string;
        species: string;
        subspecies: string;
        level: number;
        experience: number;
        alignment: string;
        background: string;
      };
      abilityScores: {
        strength: { baseScore: number; modifier: number };
        dexterity: { baseScore: number; speciesBonus?: number; totalScore?: number; modifier: number };
        constitution: { baseScore: number; modifier: number };
        intelligence: { baseScore: number; modifier: number };
        wisdom: { baseScore: number; speciesBonus?: number; totalScore?: number; modifier: number };
        charisma: { baseScore: number; modifier: number };
      };
      hitPoints: {
        hitDice: string;
        hitDiceCount: number;
        maximumHP: number;
        currentHP: number;
        temporaryHP: number;
        calculation: string;
      };
      armorAndDefense: {
        armorClass: number;
        calculation: string;
        armor: string;
        shield: string;
        speed: { value: number; unit: string };
      };
      proficiencies: {
        savingThrows: Array<{
          ability: string;
          modifier: number;
          isProficient: boolean;
          note?: string;
        }>;
        skills: Array<{
          name: string;
          ability: string;
          modifier: number;
          isProficient: boolean;
          note?: string;
        }>;
      };
      combatStats: {
        proficiencyBonus: number;
        initiative: number;
        initiative_modifier: string;
      };
      weapons: Array<{
        name: string;
        type: string;
        damage: string;
        damageType: string;
        damageModifier: number;
        totalDamage: string;
        range: string;
        properties: string[];
        weaponMastery: string;
      }>;
      classFeatures: Array<{
        name: string;
        description: string;
        selected?: string;
      }>;
      speciesTraits: Array<{
        name: string;
        description: string;
        range?: string;
      }>;
      languages: string[];
      equipment: {
        armor: string;
        weapons: string[];
        gear: string[];
        treasure: {
          goldPieces: number;
          silverPieces: number;
          copperPieces: number;
        };
      };
      spellcasting: {
        spellcastingAbility: string;
        spellSaveDC: number;
        spellAttackBonus: number;
        cantrips: Array<{
          name: string;
          damage?: string;
          damageType?: string;
          range?: string;
          castingTime?: string;
          description?: string;
        }>;
        spellsKnown: number;
        spellsPerDay: string;
      };
      notes: string;
    };
  }

  type DiscordCommand = {
    data: { name: string };
    execute: (interaction: import('discord.js').ChatInputCommandInteraction, discordClient: DiscordClient) => Promise<void>;
  };

  type DiscordClient = Client<boolean> & {
    commands: Collection<string, DiscordCommand>;
    characters: Collection<string, CharacterEntry>;
  };
}

export {};
