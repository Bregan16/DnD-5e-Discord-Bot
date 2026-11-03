import { readFileSync } from 'node:fs';
import Character from '../mongodb/models/characters.js';

function characterFixture() {
  return JSON.parse(readFileSync(
    new URL('../src/chars/gnome-ranger-character.json', import.meta.url),
    'utf8',
  ));
}

describe('Character MongoDB model', () => {
  it('preserves every field in the character JSON without embedded IDs', () => {
    const fixture = characterFixture();
    const character = new Character(fixture);

    expect(character.validateSync()).toBeUndefined();
    expect(character.toObject().character).toEqual(fixture.character);
  });

  it('requires the character wrapper and nested character data', () => {
    expect(new Character({}).validateSync()?.errors.character).toBeDefined();

    const fixture = characterFixture();
    delete fixture.character.abilityScores.wisdom;
    delete fixture.character.basicInfo.discordId;
    delete fixture.character.weapons[0].cost;
    const errors = new Character(fixture).validateSync()?.errors;

    expect(errors?.['character.abilityScores.wisdom']).toBeDefined();
    expect(errors?.['character.basicInfo.discordId']).toBeDefined();
    expect(errors?.['character.weapons.0.cost']).toBeDefined();
  });

  it('rejects invalid levels, fractional scores, and negative currency', () => {
    const fixture = characterFixture();
    fixture.character.basicInfo.level = 21;
    fixture.character.abilityScores.strength.baseScore = 10.5;
    fixture.character.equipment.treasure.goldPieces = -1;
    const errors = new Character(fixture).validateSync()?.errors;

    expect(errors?.['character.basicInfo.level']).toBeDefined();
    expect(errors?.['character.abilityScores.strength.baseScore']).toBeDefined();
    expect(errors?.['character.equipment.treasure.goldPieces']).toBeDefined();
  });

  it('allows non-spellcasters, no armor, and empty equipment arrays', () => {
    const fixture = characterFixture();
    delete fixture.character.spellcasting;
    delete fixture.character.basicInfo.subspecies;
    fixture.character.armorAndDefense.armor = null;
    fixture.character.weapons = [];
    fixture.character.equipment.weapons = [];
    fixture.character.equipment.gear = [];

    expect(new Character(fixture).validateSync()).toBeUndefined();
  });

  it('does not silently replace missing required arrays with empty arrays', () => {
    const fixture = characterFixture();
    delete fixture.character.weapons;

    expect(new Character(fixture).validateSync()?.errors['character.weapons'])
      .toBeDefined();
  });
});
