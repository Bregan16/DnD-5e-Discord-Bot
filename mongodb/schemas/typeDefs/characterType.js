import graphql from 'graphql';

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const required = type => ({ type: new GraphQLNonNull(type) });
const requiredList = type => required(new GraphQLList(type));

const AbilityType = new GraphQLObjectType({
    name: 'CharacterAbility',
    fields: {
        baseScore: required(GraphQLInt),
        speciesBonus: { type: GraphQLInt },
        totalScore: required(GraphQLInt),
        modifier: required(GraphQLInt),
    },
});

const SavingThrowType = new GraphQLObjectType({
    name: 'CharacterSavingThrow',
    fields: {
        isProficient: required(GraphQLBoolean),
    },
});

const abilityFields = type => Object.fromEntries(
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        .map(name => [name, required(type)]),
);

const CurrencyType = new GraphQLObjectType({
    name: 'CharacterCurrency',
    fields: {
        gold: required(GraphQLInt),
        silver: required(GraphQLInt),
        copper: required(GraphQLInt),
    },
});

const ArmorType = new GraphQLObjectType({
    name: 'CharacterArmor',
    fields: {
        name: required(GraphQLString),
        armorClassBonus: required(GraphQLInt),
        weight: required(GraphQLFloat),
        cost: required(CurrencyType),
    },
});

const WeaponType = new GraphQLObjectType({
    name: 'CharacterWeapon',
    fields: {
        name: required(GraphQLString),
        displayName: required(GraphQLString),
        proficiency: required(GraphQLString),
        damage: required(GraphQLString),
        damageType: required(GraphQLString),
        magic: { type: GraphQLInt },
        mastery: requiredList(GraphQLString),
        properties: requiredList(GraphQLString),
        Weight: required(GraphQLFloat),
        cost: required(CurrencyType),
    },
});

const BasicInfoType = new GraphQLObjectType({
    name: 'CharacterBasicInfo',
    fields: {
        discordId: required(GraphQLString),
        name: required(GraphQLString),
        class: required(GraphQLString),
        species: required(GraphQLString),
        subspecies: { type: GraphQLString },
        level: required(GraphQLInt),
        experience: required(GraphQLInt),
        proficiencyBonus: required(GraphQLInt),
        alignment: required(GraphQLString),
        background: required(GraphQLString),
    },
});

const AbilityScoresType = new GraphQLObjectType({
    name: 'CharacterAbilityScores',
    fields: abilityFields(AbilityType),
});

const SavingThrowsType = new GraphQLObjectType({
    name: 'CharacterSavingThrows',
    fields: abilityFields(SavingThrowType),
});

const SkillType = new GraphQLObjectType({
    name: 'CharacterSkill',
    fields: {
        name: required(GraphQLString),
        ability: required(GraphQLString),
        isProficient: required(GraphQLBoolean),
        note: { type: GraphQLString },
    },
});

const ProficienciesType = new GraphQLObjectType({
    name: 'CharacterProficiencies',
    fields: {
        savingThrows: required(SavingThrowsType),
        skills: requiredList(SkillType),
    },
});

const HitPointsType = new GraphQLObjectType({
    name: 'CharacterHitPoints',
    fields: {
        hitDice: required(GraphQLString),
        hitDiceCount: required(GraphQLInt),
        maximumHP: required(GraphQLInt),
        currentHP: required(GraphQLInt),
        temporaryHP: required(GraphQLInt),
        calculation: { type: GraphQLString },
    },
});

const SpeedType = new GraphQLObjectType({
    name: 'CharacterSpeed',
    fields: {
        value: required(GraphQLFloat),
        unit: required(GraphQLString),
    },
});

const ArmorAndDefenseType = new GraphQLObjectType({
    name: 'CharacterArmorAndDefense',
    fields: {
        calculation: { type: GraphQLString },
        armor: { type: ArmorType },
        shield: { type: GraphQLString },
        speed: required(SpeedType),
    },
});

const WeaponProficienciesType = new GraphQLObjectType({
    name: 'CharacterWeaponProficiencies',
    fields: {
        Simple: required(GraphQLBoolean),
        Martial: required(GraphQLBoolean),
    },
});

const CombatStatsType = new GraphQLObjectType({
    name: 'CharacterCombatStats',
    fields: {
        weapon_proficiencies: required(WeaponProficienciesType),
    },
});

const ClassFeatureType = new GraphQLObjectType({
    name: 'CharacterClassFeature',
    fields: {
        name: required(GraphQLString),
        description: required(GraphQLString),
        selected: { type: GraphQLString },
    },
});

const SpeciesTraitType = new GraphQLObjectType({
    name: 'CharacterSpeciesTrait',
    fields: {
        name: required(GraphQLString),
        description: required(GraphQLString),
        range: { type: GraphQLString },
    },
});

const TreasureType = new GraphQLObjectType({
    name: 'CharacterTreasure',
    fields: {
        goldPieces: required(GraphQLInt),
        silverPieces: required(GraphQLInt),
        copperPieces: required(GraphQLInt),
    },
});

const EquipmentType = new GraphQLObjectType({
    name: 'CharacterEquipment',
    fields: {
        armor: { type: GraphQLString },
        weapons: requiredList(GraphQLString),
        gear: requiredList(GraphQLString),
        treasure: required(TreasureType),
    },
});

const CantripType = new GraphQLObjectType({
    name: 'CharacterCantrip',
    fields: {
        name: required(GraphQLString),
        damage: { type: GraphQLString },
        damageType: { type: GraphQLString },
        range: { type: GraphQLString },
        castingTime: { type: GraphQLString },
        description: { type: GraphQLString },
    },
});

const SpellcastingType = new GraphQLObjectType({
    name: 'CharacterSpellcasting',
    fields: {
        spellcastingAbility: required(GraphQLString),
        spellSaveDC: required(GraphQLInt),
        spellAttackBonus: required(GraphQLInt),
        cantrips: requiredList(CantripType),
        spellsKnown: required(GraphQLInt),
        spellsPerDay: { type: GraphQLString },
    },
});

const CharacterDataType = new GraphQLObjectType({
    name: 'CharacterData',
    fields: {
        basicInfo: required(BasicInfoType),
        abilityScores: required(AbilityScoresType),
        proficiencies: required(ProficienciesType),
        hitPoints: required(HitPointsType),
        armorAndDefense: required(ArmorAndDefenseType),
        combatStats: required(CombatStatsType),
        weapons: requiredList(WeaponType),
        classFeatures: requiredList(ClassFeatureType),
        speciesTraits: requiredList(SpeciesTraitType),
        languages: requiredList(GraphQLString),
        equipment: required(EquipmentType),
        spellcasting: { type: SpellcastingType },
        notes: { type: GraphQLString },
    },
});

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: { type: GraphQLString },
        character: required(CharacterDataType),
    },
});

const AbilityInputType = new GraphQLInputObjectType({
    name: 'CharacterAbilityInput',
    fields: {
        baseScore: required(GraphQLInt),
        totalScore: required(GraphQLInt),
        modifier: required(GraphQLInt),
    },
});

const SavingThrowInputType = new GraphQLInputObjectType({
    name: 'CharacterSavingThrowInput',
    fields: {
        isProficient: required(GraphQLBoolean),
    },
});

const CurrencyInputType = new GraphQLInputObjectType({
    name: 'CharacterCurrencyInput',
    fields: {
        gold: required(GraphQLInt),
        silver: required(GraphQLInt),
        copper: required(GraphQLInt),
    },
});

const WeaponInputType = new GraphQLInputObjectType({
    name: 'CharacterWeaponInput',
    fields: {
        name: required(GraphQLString),
        displayName: required(GraphQLString),
        proficiency: required(GraphQLString),
        damage: required(GraphQLString),
        damageType: required(GraphQLString),
        mastery: requiredList(GraphQLString),
        properties: requiredList(GraphQLString),
        Weight: required(GraphQLFloat),
        cost: required(CurrencyInputType),
    },
});

const BasicInfoInputType = new GraphQLInputObjectType({
    name: 'CharacterBasicInfoInput',
    fields: {
        discordId: required(GraphQLString),
        name: required(GraphQLString),
        class: required(GraphQLString),
        species: required(GraphQLString),
        level: required(GraphQLInt),
        experience: required(GraphQLInt),
        proficiencyBonus: required(GraphQLInt),
        alignment: required(GraphQLString),
        background: required(GraphQLString),
    },
});

const AbilityScoresInputType = new GraphQLInputObjectType({
    name: 'CharacterAbilityScoresInput',
    fields: abilityFields(AbilityInputType),
});

const SavingThrowsInputType = new GraphQLInputObjectType({
    name: 'CharacterSavingThrowsInput',
    fields: abilityFields(SavingThrowInputType),
});

const SkillInputType = new GraphQLInputObjectType({
    name: 'CharacterSkillInput',
    fields: {
        name: required(GraphQLString),
        ability: required(GraphQLString),
        isProficient: required(GraphQLBoolean),
    },
});

const ProficienciesInputType = new GraphQLInputObjectType({
    name: 'CharacterProficienciesInput',
    fields: {
        savingThrows: required(SavingThrowsInputType),
        skills: requiredList(SkillInputType),
    },
});

const HitPointsInputType = new GraphQLInputObjectType({
    name: 'CharacterHitPointsInput',
    fields: {
        hitDice: required(GraphQLString),
        hitDiceCount: required(GraphQLInt),
        maximumHP: required(GraphQLInt),
        currentHP: required(GraphQLInt),
        temporaryHP: required(GraphQLInt),
    },
});

const SpeedInputType = new GraphQLInputObjectType({
    name: 'CharacterSpeedInput',
    fields: {
        value: required(GraphQLFloat),
        unit: required(GraphQLString),
    },
});

const ArmorAndDefenseInputType = new GraphQLInputObjectType({
    name: 'CharacterArmorAndDefenseInput',
    fields: {
        speed: required(SpeedInputType),
    },
});

const WeaponProficienciesInputType = new GraphQLInputObjectType({
    name: 'CharacterWeaponProficienciesInput',
    fields: {
        Simple: required(GraphQLBoolean),
        Martial: required(GraphQLBoolean),
    },
});

const CombatStatsInputType = new GraphQLInputObjectType({
    name: 'CharacterCombatStatsInput',
    fields: {
        weapon_proficiencies: required(WeaponProficienciesInputType),
    },
});

const ClassFeatureInputType = new GraphQLInputObjectType({
    name: 'CharacterClassFeatureInput',
    fields: {
        name: required(GraphQLString),
        description: required(GraphQLString),
    },
});

const SpeciesTraitInputType = new GraphQLInputObjectType({
    name: 'CharacterSpeciesTraitInput',
    fields: {
        name: required(GraphQLString),
        description: required(GraphQLString),
    },
});

const TreasureInputType = new GraphQLInputObjectType({
    name: 'CharacterTreasureInput',
    fields: {
        goldPieces: required(GraphQLInt),
        silverPieces: required(GraphQLInt),
        copperPieces: required(GraphQLInt),
    },
});

const EquipmentInputType = new GraphQLInputObjectType({
    name: 'CharacterEquipmentInput',
    fields: {
        weapons: requiredList(GraphQLString),
        gear: requiredList(GraphQLString),
        treasure: required(TreasureInputType),
    },
});

export const CharacterInputType = new GraphQLInputObjectType({
    name: 'CharacterInput',
    fields: {
        basicInfo: required(BasicInfoInputType),
        abilityScores: required(AbilityScoresInputType),
        proficiencies: required(ProficienciesInputType),
        hitPoints: required(HitPointsInputType),
        armorAndDefense: required(ArmorAndDefenseInputType),
        combatStats: required(CombatStatsInputType),
        weapons: requiredList(WeaponInputType),
        classFeatures: requiredList(ClassFeatureInputType),
        speciesTraits: requiredList(SpeciesTraitInputType),
        languages: requiredList(GraphQLString),
        equipment: required(EquipmentInputType),
    },
});

export default CharacterType;
