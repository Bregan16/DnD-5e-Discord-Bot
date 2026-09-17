import {roll} from "roll-parser";

export const getSkillEntry = (
    character: CharacterEntry['character'] | undefined,
    skillName: string,
): SkillEntry | undefined => {
    return character?.proficiencies?.skills?.find(
        (skill: SkillEntry) => skill.name.toLocaleLowerCase() === skillName.toLocaleLowerCase(),
    );
};

export const getAbilityScoresEntry = (
    character: CharacterEntry['character'] | undefined,
    abilityName: string,
): number | undefined => {
    const abilityScores = character?.abilityScores as Record<string, { modifier: number } | undefined> | undefined;
    return abilityScores?.[abilityName.toLocaleLowerCase()]?.modifier;
};

export const getSkillModifier = (
    char: CharacterEntry['character'] | undefined,
    skillName: string,
): number => {
    const skillAbility = getSkillEntry(char, skillName)?.ability;
    return skillAbility ? getAbilityScoresEntry(char, skillAbility) ?? 0 : 0;
};

export const getSkillProficiency = (
    char: CharacterEntry['character'] | undefined,
    skillName: string,
): number => {
    // Math.floor((Level - 1) / 4) + 2
    return getSkillEntry(char, skillName)?.isProficient ? 1 : 0;
};

export const getDifficultyClass = (result: number): string => {
    switch (true) {
        case (result >=30): return 'Near impossible';
        case (result >=25): return 'Hard';
        case (result >=20): return 'Hard';
        case (result >=15): return 'Medium';
        case (result >=10): return 'Easy';
        case (result >=5): return 'Very Easy';
    }
    return 'failed'
}

export const doSkillCheck = (char: any, skillName: string, options?:any) => {
    const ability = getSkillModifier(char, skillName);
    const isProficient = getSkillProficiency(char, skillName);
    const proficiencyBonus = isProficient ? char?.combatStats?.proficiencyBonus : 0;
    console.log('## skillName, ability, proficiencyBonus, options');
    console.log('##', skillName, ability, proficiencyBonus, options);
    if(options.advantage === 'advantage') {
        return roll(`2d20kh1 + ${ability} + ${proficiencyBonus} ${options.buff}`);
    } else if (options.advantage === 'disadvantage') {
        return roll(`2d20kl1 + ${ability} + ${proficiencyBonus} ${options.buff}`);
    }
    return roll(`1d20 + ${ability} + ${proficiencyBonus} ${options.buff}`);
}
