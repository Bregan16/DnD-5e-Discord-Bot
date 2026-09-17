import {roll} from "roll-parser";

export const getSkillEntry = (character: any, skillName: string) => {
    return character?.proficiencies?.skills?.find((skill: any) => skill.name.toLocaleLowerCase() === skillName);
}

export const getAbilityScoresEntry = (character: any, abilityName: string) => {
    return character?.abilityScores?.[abilityName.toLocaleLowerCase()];
}

export const getSkillModifier = (char: any, skillName: string) => {
    const skill = getSkillEntry(char, skillName);
    return getAbilityScoresEntry(char, skill?.ability)?.modifier;
}

export const doSkillChek = (char: any, skillName: string, options?:any) => {
    const ability = getSkillModifier(char, skillName);
    console.log('## options.buff', options.buff );
    return roll(`1d20 + ${ability} ${options.buff}`);
}
