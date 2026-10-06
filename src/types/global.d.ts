import {APIEmbedField, Client, Collection, ModalSubmitInteraction} from 'discord.js';

declare global {
  type SkillEntry = {
    name: string;
    ability: string;
    isProficient: boolean;
    note?: string;
  };

  type SavingThrowEntry = {
    isProficient: boolean;
  };

  type AbilityEntry = {
    baseScore: number;
    modifier: number;
    speciesBonus?: number;
    totalScore: number;
  };

  type CurrencyEntry = {
    gold: number;
    silver: number;
    copper: number;
  };

  type ArmorEntry = {
    name: string;
    armorClassBonus: number;
    weight: number;
    cost: CurrencyEntry;
  };

  type WeaponEntry = {
    name: string;
    proficiency: string;
    damage: string;
    damageType: string;
    mastery: string[];
    properties: string[];
    Weight: number;
    cost: CurrencyEntry;
  };

  interface CharacterEntry {
    character: {
      basicInfo: {
        discordId: string;
        name: string;
        class: string;
        species: string;
        subspecies: string;
        level: number;
        proficiencyBonus: number;
        experience: number;
        alignment: string;
        background: string;
      };
      abilityScores: {
        strength: AbilityEntry;
        dexterity: AbilityEntry;
        constitution: AbilityEntry;
        intelligence: AbilityEntry;
        wisdom: AbilityEntry;
        charisma: AbilityEntry;
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
        calculation: string;
        armor: ArmorEntry | null;
        shield: ArmorEntry | string | null;
        speed: { value: number; unit: string };
      };
      proficiencies: {
        savingThrows: {
          strength: SavingThrowEntry;
          dexterity: SavingThrowEntry;
          constitution: SavingThrowEntry;
          intelligence: SavingThrowEntry;
          wisdom: SavingThrowEntry;
          charisma: SavingThrowEntry;
        };
        skills: SkillEntry[];
      };
      combatStats: {
        weapon_proficiencies: {
          simple: boolean;
          martial: boolean;
        };
      };
      weapons: WeaponEntry[];
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

  type SkillRollOptions = {
    buff: string;
    buffDice: string;
    advantage: 'advantage' | 'disadvantage' | 'no';
  };

  type RespondsOption = {
    ability: string;
    skill: string;
  };

  type DiscordCommand = {
    data: { name: string };
    execute: (interaction: import('discord.js').ChatInputCommandInteraction, discordClient: DiscordClient) => Promise<void>;
    responds?: (interaction: import('discord.js').ModalSubmitInteraction, discordClient?: DiscordClient, responds: any) => Promise<void>;
  };

  type DiscordClient = Client<boolean> & {
    commands: Collection<string, DiscordCommand>;
    characters: Collection<string, CharacterEntry>;
    combat: {
      initiativeOrder: Combatant[];
      currentTurnIndex: number;
      addCharacterToInitiative: (character: CharacterEntry['character'], initiative: number) => void;
      removeCharacterFromInitiative: (characterId: string) => boolean;
      showInitiativeOrder: () => string;
      clearInitiativeOrder: () => void;
    };
  };

  type Combatant = {
    discordId: string;
    name: string;
    initiative: number;
  };

  type FieldValue = {
    key: string;
    value: string | number | undefined;
  };

  type CreateFieldProps = {
    fieldName: string;
    fieldValues: (FieldValue | null)[];
    isInline?: boolean;
    valueFormatting?: string;
    keyFormatting?: string;
  };
}

export {};
