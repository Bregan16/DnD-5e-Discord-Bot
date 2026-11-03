import mongoose from 'mongoose';

const embeddedOptions = { _id: false, id: false };
const requiredString = { type: String, required: true };
const requiredBoolean = { type: Boolean, required: true };
const abilityNames = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
];
const abilityLabels = [
  'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma',
];

function integer(min, max) {
  return {
    type: Number,
    required: true,
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    validate: {
      validator: Number.isInteger,
      message: '{PATH} must be an integer.',
    },
  };
}

function embedded(definition) {
  return new mongoose.Schema(definition, embeddedOptions);
}

function requiredDocument(schema) {
  return { type: schema, required: true };
}

function requiredArray(type) {
  return { type: [type], required: true, default: undefined };
}

const abilitySchema = embedded({
  baseScore: integer(1),
  speciesBonus: { ...integer(0), required: false },
  totalScore: integer(1),
  modifier: integer(),
});

const savingThrowSchema = embedded({
  isProficient: requiredBoolean,
});

const currencySchema = embedded({
  gold: integer(0),
  silver: integer(0),
  copper: integer(0),
});

const armorSchema = embedded({
  name: requiredString,
  armorClassBonus: integer(),
  weight: { type: Number, required: true, min: 0 },
  cost: requiredDocument(currencySchema),
});

const weaponSchema = embedded({
  name: requiredString,
  displayName: requiredString,
  proficiency: requiredString,
  damage: requiredString,
  damageType: requiredString,
  magic: { ...integer(), required: false },
  mastery: requiredArray(String),
  properties: requiredArray(String),
  Weight: { type: Number, required: true, min: 0 },
  cost: requiredDocument(currencySchema),
});

const characterDataSchema = embedded({
  basicInfo: requiredDocument(embedded({
    discordId: requiredString,
    name: requiredString,
    class: requiredString,
    species: requiredString,
    subspecies: String,
    level: integer(1, 20),
    experience: integer(0),
    proficiencyBonus: integer(0),
    alignment: requiredString,
    background: requiredString,
  })),
  abilityScores: requiredDocument(embedded(Object.fromEntries(
    abilityNames.map(name => [name, requiredDocument(abilitySchema)]),
  ))),
  proficiencies: requiredDocument(embedded({
    savingThrows: requiredDocument(embedded(Object.fromEntries(
      abilityNames.map(name => [name, requiredDocument(savingThrowSchema)]),
    ))),
    skills: requiredArray(embedded({
      name: requiredString,
      ability: { type: String, required: true, enum: abilityLabels },
      isProficient: requiredBoolean,
      note: String,
    })),
  })),
  hitPoints: requiredDocument(embedded({
    hitDice: requiredString,
    hitDiceCount: integer(0),
    maximumHP: integer(0),
    currentHP: integer(0),
    temporaryHP: integer(0),
    calculation: String,
  })),
  armorAndDefense: requiredDocument(embedded({
    calculation: String,
    armor: armorSchema,
    shield: String,
    speed: requiredDocument(embedded({
      value: { type: Number, required: true, min: 0 },
      unit: requiredString,
    })),
  })),
  combatStats: requiredDocument(embedded({
    weapon_proficiencies: requiredDocument(embedded({
      Simple: requiredBoolean,
      Martial: requiredBoolean,
    })),
  })),
  weapons: requiredArray(weaponSchema),
  classFeatures: requiredArray(embedded({
    name: requiredString,
    description: requiredString,
    selected: String,
  })),
  speciesTraits: requiredArray(embedded({
    name: requiredString,
    description: requiredString,
    range: String,
  })),
  languages: requiredArray(String),
  equipment: requiredDocument(embedded({
    armor: String,
    weapons: requiredArray(String),
    gear: requiredArray(String),
    treasure: requiredDocument(embedded({
      goldPieces: integer(0),
      silverPieces: integer(0),
      copperPieces: integer(0),
    })),
  })),
  spellcasting: embedded({
    spellcastingAbility: { type: String, required: true, enum: abilityLabels },
    spellSaveDC: integer(0),
    spellAttackBonus: integer(),
    cantrips: requiredArray(embedded({
      name: requiredString,
      damage: String,
      damageType: String,
      range: String,
      castingTime: String,
      description: String,
    })),
    spellsKnown: integer(0),
    spellsPerDay: String,
  }),
  notes: String,
});

export const characterSchema = new mongoose.Schema({
  character: requiredDocument(characterDataSchema),
});

characterSchema.index({ 'character.basicInfo.discordId': 1 });

const Character = mongoose.model('Character', characterSchema);

export default Character;
