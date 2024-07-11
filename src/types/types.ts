import { Item } from "../classes/Item";
import { ItemCategories, ItemCategory, UIItemCategory } from "./enums";

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
	staves: Category;
	[key: string]: Category;
};

type CategoryBuildInfo = {
	excludePreviouslyRolled: boolean;
	buildNums: number;
	previouslyRolled: Set<number>;
};

type BuildInfo = {
	categoryConfigs: Map<ItemCategory, CategoryBuildInfo>;
	enabledCategories: Set<ItemCategory>;
	[key: string]: Map<ItemCategory, CategoryBuildInfo> | Set<ItemCategory>;
};

type BuildGenerationConfig = {
	includeDlc: boolean;
	buildInfo: BuildInfo;
	[key: string]: BuildInfo | boolean;
};

const defaultCategoryBuildInfo: Map<ItemCategory, CategoryBuildInfo> = new Map();
for (const c of Object.values(ItemCategory)) {
	if ([ItemCategory.Helm, ItemCategory.Chest, ItemCategory.Gauntlets, ItemCategory.Leg].includes(c)) {
		defaultCategoryBuildInfo.set(c, {
			excludePreviouslyRolled: true,
			buildNums: 1,
			previouslyRolled: new Set<number>(),
		});
	} else {
		defaultCategoryBuildInfo.set(c, {
			excludePreviouslyRolled: true,
			buildNums: 2,
			previouslyRolled: new Set<number>(),
		});
	}
}
const defaultBuildInfo: BuildInfo = {
	categoryConfigs: defaultCategoryBuildInfo,
	enabledCategories: new Set([...ItemCategories]),
};

const defaultBuildGenerationConfig: BuildGenerationConfig = {
	includeDlc: true,
	buildInfo: defaultBuildInfo,
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
	items: Map<UIItemCategory, Item[]>;
	[key: string]: string | number | Map<UIItemCategory, Item[]>;
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

type ToastCategories = {
	ashes: boolean;
	incants: boolean;
	seals: boolean;
	shields: boolean;
	sorcs: boolean;
	spirits: boolean;
	staves: boolean;
	talismans: boolean;
	tears: boolean;
	weapons: boolean;
	[key: string]: boolean;
};

interface Items {
	helms: number[];
	chests: number[];
	gauntlets: number[];
	legs: number[];
	talismans: number[];
	sorcs: number[];
	weapons: number[];
	ashes: number[];
	incants: number[];
	seals: number[];
	tears: number[];
	shields: number[];
	spirits: number[];
	staves: number[];
	[key: string]: number[];
}

export type { AIOutput, BuildGenerationConfig, ItemData, BuildInfo, AIBuildType, Stat, ToastCategories, Items };
export { defaultBuildGenerationConfig };
