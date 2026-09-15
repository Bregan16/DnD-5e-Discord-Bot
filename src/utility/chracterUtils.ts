export const getSkillEntry = (character: any, skillName: string) => {
    return character?.proficiencies?.skills?.find((skill: any) => skill.name === skillName);
}

export const getAbilityScoresEntry = (character: any, abilityName: string) => {
    return character?.abilityScores?.[abilityName.toLocaleLowerCase()];
}

export const getSkillModifier = (char: any, skillName: string) => {
    const skill = getSkillEntry(char, skillName);
    return getAbilityScoresEntry(char, skill?.ability)?.modifier;
}
