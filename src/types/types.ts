type BuildNums = {
	helms: number;
	chests: number;
	gauntlets: number;
	legs: number;
	classes: number;
	ashes: number;
	tears: number;
	incants: number;
	seals: number;
	shields: number;
	sorcs: number;
	spirits: number;
	talismans: number;
	weapons: number;
	[key: string]: number;
};

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
	[key: string]: Category;
};

type ExcludePreviuouslyRolled = {
	helms: boolean;
	chests: boolean;
	gauntlets: boolean;
	legs: boolean;
	talismans: boolean;
	spirits: boolean;
	ashes: boolean;
	classes: boolean;
	shields: boolean;
	sorcs: boolean;
	weapons: boolean;
	tears: boolean;
	incants: boolean;
	[key: string]: boolean;
};

export type { BuildNums, ItemData, ExcludePreviuouslyRolled };
