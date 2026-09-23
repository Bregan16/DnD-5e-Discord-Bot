import { roll } from 'roll-parser';

export const getProficiencyBonus = (
	char: CharacterEntry['character'] | undefined,
): number => {
	return char?.combatStats?.proficiencyBonus ?? 0;
};

export const getAbilityEntry = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
): AbilityEntry | undefined => {
	const abilityScores = char?.abilityScores as Record<string, AbilityEntry | undefined> | undefined;
	return abilityScores?.[abilityName.toLocaleLowerCase()];
};

export const getAbilityModifier = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
): number | undefined => {
	return getAbilityEntry(char, abilityName)?.modifier;
};

export const getSavingThrowEntry = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
): SavingThrowEntry | undefined => {
	return char?.proficiencies?.savingThrows?.find(
		(savingThrow: SavingThrowEntry) => savingThrow.ability.toLocaleLowerCase() === abilityName.toLocaleLowerCase(),
	);
};

export const hasSavingThrowProficiency = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
): boolean => {
	return getSavingThrowEntry(char, abilityName)?.isProficient ?? false;
};

export const getSkillEntry = (
	char: CharacterEntry['character'] | undefined,
	skillName: string,
): SkillEntry | undefined => {
	return char?.proficiencies?.skills?.find(
		(skill: SkillEntry) => skill.name.toLocaleLowerCase() === skillName.toLocaleLowerCase(),
	);
};

export const getSkillAbility = (
	char: CharacterEntry['character'] | undefined,
	skillName: string,
): string => {
	return getSkillEntry(char, skillName)?.ability || '';
};

export const getSkillModifier = (
	char: CharacterEntry['character'] | undefined,
	skillName: string,
): number => {
	const skillAbility:string = getSkillAbility(char, skillName);
	return getAbilityModifier(char, skillAbility) ?? 0;
};

export const hasSkillProficiency = (
	char: CharacterEntry['character'] | undefined,
	skillName: string,
): boolean => {
	// Math.floor((Level - 1) / 4) + 2
	return getSkillEntry(char, skillName)?.isProficient ?? false;
};

export const getDifficultyClass = (result: number): string => {
	switch (true) {
	case (result >= 30): return 'Near impossible';
	case (result >= 25): return 'Hard';
	case (result >= 20): return 'Hard';
	case (result >= 15): return 'Medium';
	case (result >= 10): return 'Easy';
	case (result >= 5): return 'Very Easy';
	}
	return 'failed';
};

export const doSkillCheck = (
	char: CharacterEntry['character'] | undefined,
	skillName: string,
	options?: {
		buff: string;
		buffDice: string;
		advantage: 'advantage' | 'disadvantage' | 'no';
	},
) : ReturnType<typeof roll> => {
	const abilityModifier:number = getSkillModifier(char, skillName);
	const isProficient:boolean = hasSkillProficiency(char, skillName);
	const proficiencyBonus:number = isProficient ? getProficiencyBonus(char) : 0;

	console.log('## skillName, ability, proficiencyBonus, options');
	console.log('##', skillName, abilityModifier, proficiencyBonus, options);
	if (options?.advantage === 'advantage') {
		return roll(`2d20kh1 + ${abilityModifier} + ${proficiencyBonus} ${options.buff ?? ''} ${options.buffDice ?? ''}`);
	}
	if (options?.advantage === 'disadvantage') {
		return roll(`2d20kl1 + ${abilityModifier} + ${proficiencyBonus} ${options.buff ?? ''} ${options.buffDice ?? ''}`);
	}
	return roll(`1d20 + ${abilityModifier} + ${proficiencyBonus} ${options?.buff ?? ''} ${options?.buffDice ?? ''}`);
};

export const doSavingThrowCheck = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
	options?: {
		buff: string;
		buffDice: string;
		advantage: 'advantage' | 'disadvantage' | 'no';
	},
) : ReturnType<typeof roll> => {
	const isProficient = hasSavingThrowProficiency(char, abilityName);
	const proficiencyBonus = isProficient ? getProficiencyBonus(char) : 0;
	return doAbilityCheck(char, abilityName, options, proficiencyBonus);
}

export const doAbilityCheck = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
	options?: {
		buff: string;
		buffDice: string;
		advantage: 'advantage' | 'disadvantage' | 'no';
	},
	proficiencyBonus: number | null = null
) : ReturnType<typeof roll> => {
	const ability = getAbilityEntry(char, abilityName);
	const proficiencyBonusValue = proficiencyBonus ? `+ ${proficiencyBonus}` : '';

	console.log('## abilityName, ability, proficiencyBonus, options');
	console.log('##', abilityName, ability?.modifier, proficiencyBonusValue, options);
	if (options?.advantage === 'advantage') {
		return roll(`2d20kh1 + ${ability?.modifier ?? 0} ${proficiencyBonusValue} ${options.buff ?? ''} ${options?.buffDice ?? ''}`);
	}
	if (options?.advantage === 'disadvantage') {
		return roll(`2d20kl1 + ${ability?.modifier ?? 0} ${proficiencyBonusValue} ${options.buff ?? ''} ${options?.buffDice ?? ''}`);
	}
	return roll(`1d20 + ${ability?.modifier ?? 0} ${proficiencyBonusValue} ${options?.buff ?? ''} ${options?.buffDice ?? ''}`);
};
