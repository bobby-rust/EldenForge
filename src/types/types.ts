import { Item } from "../classes/Item";
import { ItemCategory } from "./enums";

/**
 * An item category has `count` items and a list of that category's items
 */
type Category = {
	count: number;
	items: any[];
};

/**
 * The structure of the JSON data
 * For consistency purposes, all abbreviations used here should be consistent
 * throughout the codebase, only exception being the raw data file, which does not use abbreviations.
 * The pluralized item categories refers to a list of
 * that category, and singular categories refers to an individual piece of that category.
 */
type ItemData = {
	helms: Category;
	chests: Category;
	gauntlets: Category;
	legs: Category;
	talismans: Category;
	spirits: Category;
	ashes: Category;
	classes: Category;
	shields: Category;
	sorcs: Category;
	weapons: Category;
	tears: Category;
	incants: Category;
	seals: Category;
	[key: string]: Category;
};

type BuildInfo = {
	excludePreviouslyRolled: boolean;
	buildNums: number;
	previouslyRolled: Set<number>;
};

type BuildGenerationConfig = {
	helms: BuildInfo;
	chests: BuildInfo;
	gauntlets: BuildInfo;
	legs: BuildInfo;
	talismans: BuildInfo;
	spirits: BuildInfo;
	ashes: BuildInfo;
	classes: BuildInfo;
	shields: BuildInfo;
	sorcs: BuildInfo;
	weapons: BuildInfo;
	tears: BuildInfo;
	incants: BuildInfo;
	seals: BuildInfo;
	[key: string]: BuildInfo;
};

const defaultBuildGenerationConfig: BuildGenerationConfig = {
	helms: {
		excludePreviouslyRolled: true,
		buildNums: 1,
		previouslyRolled: new Set<number>(),
	},
	chests: {
		excludePreviouslyRolled: true,
		buildNums: 1,
		previouslyRolled: new Set<number>(),
	},
	gauntlets: {
		excludePreviouslyRolled: true,
		buildNums: 1,
		previouslyRolled: new Set<number>(),
	},
	legs: {
		excludePreviouslyRolled: true,
		buildNums: 1,
		previouslyRolled: new Set<number>(),
	},
	weapons: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	tears: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	incants: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	talismans: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	spirits: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	ashes: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	classes: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	shields: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	sorcs: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
	seals: {
		excludePreviouslyRolled: true,
		buildNums: 2,
		previouslyRolled: new Set<number>(),
	},
};

type Stat = {
	vigor: number;
	mind: number;
	endurance: number;
	strength: number;
	dexterity: number;
	intelligence: number;
	faith: number;
	arcane: number;
};

type AIBuildType = Stat & {
	name: string;
	summary: string;
	strengths: string;
	weaknesses: string;
	items: Map<ItemCategory, Item[]>;
	[key: string]: string | number | Map<ItemCategory, Item[]>;
};

type AIOutput = {
	name: string;
	stats: {
		vigor: string;
		mind: string;
		endurance: string;
		strength: string;
		dexterity: string;
		intelligence: string;
		faith: string;
		arcane: string;
	};
	class: string;
	helm: string;
	chest_armor: string;
	gauntlets: string;
	leg_armor: string;
	weapons: string;
	ashes_of_war: string;
	sacred_seals: string;
	incantations: string;
	shields: string;
	talismans: string;
	crystal_tears: string;
	spirit_ashes: string;
	sorceries: string;
	summary: string;
	strengths: string;
	weaknesses: string;
};

export type { AIOutput, BuildGenerationConfig, ItemData, BuildInfo, AIBuildType, Stat };
export { defaultBuildGenerationConfig };
