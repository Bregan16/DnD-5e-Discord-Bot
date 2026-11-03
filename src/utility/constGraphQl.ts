export const allCharactersQuery = `{
    id
    name
}`;

export const completeCharacterDataQuery = `{
    id
    character {
      basicInfo {
        name
        discordId
        species
        level
        class
        subspecies
        alignment
        background
        proficiencyBonus
        experience
      }
      abilityScores{
        strength{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
        dexterity{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
        constitution{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
        intelligence{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
        wisdom{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
        charisma{
          baseScore
          speciesBonus
          totalScore
          modifier
        }
      }
      proficiencies {
        savingThrows {
          strength { isProficient }
          dexterity { isProficient }
          constitution { isProficient }
          intelligence { isProficient }
          wisdom { isProficient }
          charisma { isProficient }
        }
        skills {
          name
          ability
          isProficient
          note
        }
      }
      hitPoints {
        hitDice
        hitDiceCount
        maximumHP
        currentHP
        temporaryHP
        calculation
      }
      armorAndDefense {
        calculation
        armor {
          name
          armorClassBonus
          weight
          cost { gold silver copper }
        }
        shield
        speed { value unit }
      }
      combatStats {
        weapon_proficiencies { Simple Martial }
      }
      weapons {
        name
        displayName
        proficiency
        damage
        damageType
        magic
        mastery
        properties
        Weight
        cost { gold silver copper }
      }
      classFeatures {
        name
        description
        selected
      }
      speciesTraits {
        name
        description
        range
      }
      languages
      equipment {
        armor
        weapons
        gear
        treasure { goldPieces silverPieces copperPieces }
      }
      spellcasting {
        spellcastingAbility
        spellSaveDC
        spellAttackBonus
        cantrips {
          name
          damage
          damageType
          range
          castingTime
          description
        }
        spellsKnown
        spellsPerDay
      }
      notes
    }
}`;
