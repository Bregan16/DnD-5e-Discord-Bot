import { roll } from 'roll-parser';

export const getProficiencyBonus = (
	char: CharacterEntry['character'] | undefined,
): number => {
	return char?.basicInfo?.proficiencyBonus ?? 0;
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
	return char?.proficiencies?.savingThrows[abilityName.toLocaleLowerCase()];
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
	case (result >= 25): return 'Very Hard';
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
	console.log('## doSkillCheck');
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
	console.log('## doSavingThrowCheck');
	const isProficient = hasSavingThrowProficiency(char, abilityName);
	const proficiencyBonus = isProficient ? getProficiencyBonus(char) : 0;
	return doAbilityCheck(char, abilityName, options, proficiencyBonus);
};

export const doAbilityCheck = (
	char: CharacterEntry['character'] | undefined,
	abilityName: string,
	options?: {
		buff: string;
		buffDice: string;
		advantage: 'advantage' | 'disadvantage' | 'no';
	},
	proficiencyBonus: number | null = null,
) : ReturnType<typeof roll> => {
	console.log('## doAbilityCheck');
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

export const doAttackRoll = (
	character: CharacterEntry['character'] | undefined,
	weaponName: string,
): ReturnType<typeof roll> => {
	if (!character) {
		return roll('1d20');
	}
	const weapon = character.weapons.find(w => w.name === weaponName);
	if (!weapon) {
		throw new Error(`Weapon ${weaponName} not found`);
	}
	const properties = weapon.properties.map(property => property.toLocaleLowerCase());
	const isRanged = properties.some(property => property.startsWith('range'));
	const isFinesse = properties.includes('finesse');
	const strengthModifier = character.abilityScores.strength.modifier;
	const dexterityModifier = character.abilityScores.dexterity.modifier;
	const abilityModifier = isRanged
		? dexterityModifier
		: isFinesse
			? Math.max(strengthModifier, dexterityModifier)
			: strengthModifier;
	const weaponProficiencies = character.combatStats.weapon_proficiencies;
	const isProficient = Object.entries(weaponProficiencies).some(
		([category, proficient]) => category.toLocaleLowerCase() === weapon.proficiency.toLocaleLowerCase() && proficient,
	);
	const proficiencyBonus = isProficient ? character.basicInfo.proficiencyBonus : 0;
	const magicBonus = weapon.magic ?? 0;
	const totalBonus = abilityModifier + proficiencyBonus + magicBonus;

	return roll(`1d20 + ${totalBonus}`);
};
