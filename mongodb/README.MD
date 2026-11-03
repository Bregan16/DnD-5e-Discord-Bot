Get Character GraphQL Client
```
query {
  getCharacter(id: "6aea31e19c845a82b6f0aac1") {
    character {
      basicInfo {
        name
      }
    }
  }
}
```
Delete Character GraphQL Client
```
mutation {
  deleteCharacter(id: "6aea31e19c845a82b6f0aac1") {
    id
    character {
      basicInfo {
        name
      }
    }
  }
}
```
Update Character GraphQL Client
```
mutation {
  updateCharacter(
    id: "507f1f77bcf86cd799439011"
    name: "Bregan the Ranger"
  ) {
    id
    character {
      basicInfo {
        name
      }
    }
  }
}
```
Add Character GraphQL Client
```
mutation CreateCharacter($character: CharacterInput!) {
  createCharacter(character: $character) {
    id
    character {
      basicInfo {
        name
        class
        level
      }
    }
  }
}
```
CharacterInput example for Bregan the Gnome Ranger:
```
{
  "character": {
    "basicInfo": {
      "discordId": "sindbad9050",
      "name": "Bregan",
      "class": "Ranger",
      "species": "Gnome",
      "level": 1,
      "experience": 0,
      "proficiencyBonus": 2,
      "alignment": "Chaotic Good",
      "background": "Haunted One"
    },
    "abilityScores": {
      "strength": { "baseScore": 10, "totalScore": 10, "modifier": 0 },
      "dexterity": { "baseScore": 15, "totalScore": 17, "modifier": 3 },
      "constitution": { "baseScore": 14, "totalScore": 14, "modifier": 2 },
      "intelligence": { "baseScore": 12, "totalScore": 12, "modifier": 1 },
      "wisdom": { "baseScore": 14, "totalScore": 15, "modifier": 2 },
      "charisma": { "baseScore": 8, "totalScore": 8, "modifier": -1 }
    },
    "proficiencies": {
      "savingThrows": {
        "strength": { "isProficient": true },
        "dexterity": { "isProficient": true },
        "constitution": { "isProficient": false },
        "intelligence": { "isProficient": false },
        "wisdom": { "isProficient": false },
        "charisma": { "isProficient": false }
      },
      "skills": [
        { "name": "Acrobatics", "ability": "Dexterity", "isProficient": false },
        { "name": "Animal Handling", "ability": "Wisdom", "isProficient": true },
        { "name": "Arcana", "ability": "Intelligence", "isProficient": false },
        { "name": "Athletics", "ability": "Strength", "isProficient": false },
        { "name": "Deception", "ability": "Charisma", "isProficient": false },
        { "name": "History", "ability": "Intelligence", "isProficient": false },
        { "name": "Insight", "ability": "Wisdom", "isProficient": false },
        { "name": "Intimidation", "ability": "Charisma", "isProficient": false },
        { "name": "Investigation", "ability": "Intelligence", "isProficient": false },
        { "name": "Medicine", "ability": "Wisdom", "isProficient": false },
        { "name": "Nature", "ability": "Intelligence", "isProficient": false },
        { "name": "Perception", "ability": "Wisdom", "isProficient": true },
        { "name": "Performance", "ability": "Charisma", "isProficient": false },
        { "name": "Persuasion", "ability": "Charisma", "isProficient": false },
        { "name": "Religion", "ability": "Intelligence", "isProficient": true },
        { "name": "Sleight of Hand", "ability": "Dexterity", "isProficient": false },
        { "name": "Stealth", "ability": "Dexterity", "isProficient": true },
        { "name": "Survival", "ability": "Wisdom", "isProficient": true }
      ]
    },
    "hitPoints": {
      "hitDice": "1d10",
      "hitDiceCount": 1,
      "maximumHP": 12,
      "currentHP": 12,
      "temporaryHP": 0
    },
    "armorAndDefense": {
      "speed": { "value": 30, "unit": "feet" }
    },
    "combatStats": {
      "weapon_proficiencies": {
        "Simple": true,
        "Martial": true
      }
    },
    "weapons": [
      {
        "name": "shortbow",
        "displayName": "Shortbow",
        "proficiency": "Simple",
        "damage": "1d6",
        "damageType": "Piercing",
        "mastery": ["Vex"],
        "properties": ["Ammunition", "Two-handed", "Range 80/320", "Magic"],
        "Weight": 2,
        "cost": { "gold": 25, "silver": 0, "copper": 0 }
      },
      {
        "name": "shortsword",
        "displayName": "Shortsword",
        "proficiency": "Martial",
        "damage": "1d6",
        "damageType": "Piercing",
        "mastery": ["Vex"],
        "properties": ["Finesse", "Light"],
        "Weight": 2,
        "cost": { "gold": 10, "silver": 0, "copper": 0 }
      }
    ],
    "classFeatures": [
      {
        "name": "Spellcasting",
        "description": "You have learned to use the magical essence of nature to cast spells, much the way a druid does. You know two cantrips of your choice from the Ranger spell list. You prepare spells equal to your Wisdom modifier + half your Ranger level (rounded down, minimum of one spell)."
      },
      {
        "name": "Fighting Style",
        "description": "You gain a +2 bonus to attack rolls you make with ranged weapons."
      },
      {
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use them with exceptional skill. You gain a special benefit when you attack with a weapon you're proficient with and the weapon has the mastery property."
      }
    ],
    "speciesTraits": [
      {
        "name": "Ability Score Increase",
        "description": "When determining your ability scores, increase one score by 2 and another score by 1, or increase three different scores by 1. You can't increase an ability score above 20 using this feature unless your description states otherwise."
      },
      {
        "name": "Creature Type",
        "description": "You are a Humanoid."
      },
      {
        "name": "Size",
        "description": "You are Small."
      },
      {
        "name": "Speed",
        "description": "Your walking speed is 30 feet."
      },
      {
        "name": "Darkvision",
        "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        "name": "Gnome Cunning",
        "description": "You have advantage on saving throws you make against spells and magical effects."
      },
      {
        "name": "Speak with Small Beasts",
        "description": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts."
      }
    ],
    "languages": ["Common", "Gnomish"],
    "equipment": {
      "weapons": ["Shortbow", "Shortsword"],
      "gear": [
        "Quiver with 20 arrows",
        "Dungeoneer's Pack",
        "Bedroll",
        "Rope (50 ft)",
        "Tinker's Tools",
        "Traveler's Clothes",
        "Backpack",
        "Waterskin"
      ],
      "treasure": {
        "goldPieces": 5,
        "silverPieces": 0,
        "copperPieces": 0
      }
    }
  }
}
```
CharacterInput example for Chrome Dulli the Gnome Rogue:
```
{
  "character": {
    "basicInfo": {
      "discordId": "bregan1971",
      "name": "Chrome Dulli",
      "class": "Rogue",
      "species": "Gnome",
      "level": 1,
      "experience": 0,
      "proficiencyBonus": 2,
      "alignment": "Chaotic Good",
      "background": "Haunted One"
    },
    "abilityScores": {
      "strength": { "baseScore": 10, "totalScore": 10, "modifier": 0 },
      "dexterity": { "baseScore": 15, "totalScore": 17, "modifier": 3 },
      "constitution": { "baseScore": 14, "totalScore": 14, "modifier": 2 },
      "intelligence": { "baseScore": 12, "totalScore": 12, "modifier": 1 },
      "wisdom": { "baseScore": 14, "totalScore": 15, "modifier": 2 },
      "charisma": { "baseScore": 8, "totalScore": 8, "modifier": -1 }
    },
    "proficiencies": {
      "savingThrows": {
        "strength": { "isProficient": false },
        "dexterity": { "isProficient": true },
        "constitution": { "isProficient": false },
        "intelligence": { "isProficient": true },
        "wisdom": { "isProficient": false },
        "charisma": { "isProficient": false }
      },
      "skills": [
        { "name": "Acrobatics", "ability": "Dexterity", "isProficient": true },
        { "name": "Animal Handling", "ability": "Wisdom", "isProficient": true },
        { "name": "Arcana", "ability": "Intelligence", "isProficient": false },
        { "name": "Athletics", "ability": "Strength", "isProficient": false },
        { "name": "Deception", "ability": "Charisma", "isProficient": false },
        { "name": "History", "ability": "Intelligence", "isProficient": false },
        { "name": "Insight", "ability": "Wisdom", "isProficient": false },
        { "name": "Intimidation", "ability": "Charisma", "isProficient": false },
        { "name": "Investigation", "ability": "Intelligence", "isProficient": false },
        { "name": "Medicine", "ability": "Wisdom", "isProficient": false },
        { "name": "Nature", "ability": "Intelligence", "isProficient": false },
        { "name": "Perception", "ability": "Wisdom", "isProficient": true },
        { "name": "Performance", "ability": "Charisma", "isProficient": false },
        { "name": "Persuasion", "ability": "Charisma", "isProficient": false },
        { "name": "Religion", "ability": "Intelligence", "isProficient": true },
        { "name": "Sleight of Hand", "ability": "Dexterity", "isProficient": false },
        { "name": "Stealth", "ability": "Dexterity", "isProficient": true },
        { "name": "Survival", "ability": "Wisdom", "isProficient": true }
      ]
    },
    "hitPoints": {
      "hitDice": "1d8",
      "hitDiceCount": 1,
      "maximumHP": 10,
      "currentHP": 10,
      "temporaryHP": 0
    },
    "armorAndDefense": {
      "speed": { "value": 30, "unit": "feet" }
    },
    "combatStats": {
      "weapon_proficiencies": {
        "Simple": true,
        "Martial": true
      }
    },
    "weapons": [
      {
        "name": "scimitar",
        "displayName": "Scimitar of speed",
        "proficiency": "Martial",
        "damage": "1d6",
        "damageType": "Slashing",
        "mastery": ["Nick"],
        "properties": ["Finesse", "Light"],
        "Weight": 3,
        "cost": { "gold": 25, "silver": 0, "copper": 0 }
      },
      {
        "name": "shortsword",
        "displayName": "Shortsword",
        "proficiency": "martial",
        "damage": "1d6",
        "damageType": "Piercing",
        "mastery": ["Vex"],
        "properties": ["Finesse", "Light", "Magic"],
        "Weight": 2,
        "cost": { "gold": 10, "silver": 0, "copper": 0 }
      },
      {
        "name": "longsword",
        "displayName": "Longsword",
        "proficiency": "martial",
        "damage": "1d8",
        "damageType": "Slashing",
        "mastery": ["Sap"],
        "properties": ["Versatile 1d10"],
        "Weight": 3,
        "cost": { "gold": 15, "silver": 0, "copper": 0 }
      },
      {
        "name": "shortbow",
        "displayName": "Shortbow",
        "proficiency": "Simple",
        "damage": "1d6",
        "damageType": "Piercing",
        "mastery": ["Vex"],
        "properties": ["Ammunition", "Two-handed", "Range 80/320", "Magic"],
        "Weight": 2,
        "cost": { "gold": 25, "silver": 0, "copper": 0 }
      }
    ],
    "classFeatures": [
      {
        "name": "Spellcasting",
        "description": "You have learned to use the magical essence of nature to cast spells, much the way a druid does. You know two cantrips of your choice from the Ranger spell list. You prepare spells equal to your Wisdom modifier + half your Ranger level (rounded down, minimum of one spell)."
      },
      {
        "name": "Fighting Style",
        "description": "You gain a +2 bonus to attack rolls you make with ranged weapons."
      },
      {
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use them with exceptional skill. You gain a special benefit when you attack with a weapon you're proficient with and the weapon has the mastery property."
      }
    ],
    "speciesTraits": [
      {
        "name": "Ability Score Increase",
        "description": "When determining your ability scores, increase one score by 2 and another score by 1, or increase three different scores by 1. You can't increase an ability score above 20 using this feature unless your description states otherwise."
      },
      {
        "name": "Creature Type",
        "description": "You are a Humanoid."
      },
      {
        "name": "Size",
        "description": "You are Small."
      },
      {
        "name": "Speed",
        "description": "Your walking speed is 30 feet."
      },
      {
        "name": "Darkvision",
        "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
      },
      {
        "name": "Gnome Cunning",
        "description": "You have advantage on saving throws you make against spells and magical effects."
      },
      {
        "name": "Speak with Small Beasts",
        "description": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts."
      }
    ],
    "languages": ["Common", "Gnomish"],
    "equipment": {
      "weapons": ["Shortbow", "Shortsword"],
      "gear": [
        "Quiver with 20 arrows",
        "Dungeoneer's Pack",
        "Bedroll",
        "Rope (50 ft)",
        "Tinker's Tools",
        "Traveler's Clothes",
        "Backpack",
        "Waterskin"
      ],
      "treasure": {
        "goldPieces": 5,
        "silverPieces": 0,
        "copperPieces": 0
      }
    }
  }
}
```