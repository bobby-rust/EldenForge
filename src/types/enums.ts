/**
 * A UI-friendly name for each item type.
 */
export enum ReadableItemCategory {
	Ashes = "Ashes Of War",
	Helm = "Helmet",
	Chest = "Chest Armor",
	Gauntlets = "Gauntlets",
	Leg = "Leg Armor",
	Staves = "Staves",
	Weapons = "Weapons",
	Shields = "Shields",
	Class = "Starting Class",
	Tears = "Crystal Tears",
	Incantations = "Incantations",
	Seals = "Sacred Seals",
	Spirits = "Spirit Ashes",
	Talismans = "Talismans",
	Sorcs = "Sorceries",
}

export enum RegenerationTypes {
	Armors = "armors",
	Helm = "helms",
	Chest = "chests",
	Gauntlets = "gauntlets",
	Leg = "legs",
	Weapons = "weapons",
	Ashes = "ashes",
	Seals = "seals",
	Incants = "incants",
	Staves = "staves",
	Sorcs = "sorcs",
	Shields = "shields",
	Talismans = "talismans",
	Tears = "tears",
	Spirits = "spirits",
	Classes = "classes",
}

/**
 * A non-renderable name for each item type.
 * These are the keys used in the data file.
 * This is the type to use for everything
 * in the logic of the application.
 */
export enum ItemCategory {
	Helm = "helms",
	Chest = "chests",
	Gauntlets = "gauntlets",
	Leg = "legs",
	Weapons = "weapons",
	Ashes = "ashes",
	Seals = "seals",
	Incants = "incants",
	Staves = "staves",
	Sorcs = "sorcs",
	Shields = "shields",
	Talismans = "talismans",
	Tears = "tears",
	Spirits = "spirits",
	Classes = "classes",
}

export const ItemCategories = new Set<ItemCategory>([
	ItemCategory.Helm,
	ItemCategory.Chest,
	ItemCategory.Gauntlets,
	ItemCategory.Leg,
	ItemCategory.Weapons,
	ItemCategory.Ashes,
	ItemCategory.Seals,
	ItemCategory.Incants,
	ItemCategory.Staves,
	ItemCategory.Sorcs,
	ItemCategory.Shields,
	ItemCategory.Talismans,
	ItemCategory.Tears,
	ItemCategory.Spirits,
	ItemCategory.Classes,
]);

/**
 * The categories of items presented to the user in the UI
 */
export enum UIItemCategory {
	Armors = "Armors",
	Weapons = "Weapons",
	Ashes = "Ashes Of War",
	Staves = "Staves",
	Sorcs = "Sorceries",
	Seals = "Sacred Seals",
	Incants = "Incantations",
	Shields = "Shields",
	Talismans = "Talismans",
	Tears = "Crystal Tears",
	Spirits = "Spirit Ashes",
	Classes = "Starting Class",
}

export const UIItemCategories = new Set<UIItemCategory>([
	UIItemCategory.Armors,
	UIItemCategory.Weapons,
	UIItemCategory.Ashes,
	UIItemCategory.Staves,
	UIItemCategory.Sorcs,
	UIItemCategory.Seals,
	UIItemCategory.Incants,
	UIItemCategory.Shields,
	UIItemCategory.Talismans,
	UIItemCategory.Tears,
	UIItemCategory.Spirits,
	UIItemCategory.Classes,
]);

export const UICategoryToItemCategory = new Map<UIItemCategory, ItemCategory>([
	[UIItemCategory.Armors, ItemCategory.Helm],
	[UIItemCategory.Weapons, ItemCategory.Weapons],
	[UIItemCategory.Ashes, ItemCategory.Ashes],
	[UIItemCategory.Staves, ItemCategory.Staves],
	[UIItemCategory.Sorcs, ItemCategory.Sorcs],
	[UIItemCategory.Seals, ItemCategory.Seals],
	[UIItemCategory.Incants, ItemCategory.Incants],
	[UIItemCategory.Shields, ItemCategory.Shields],
	[UIItemCategory.Talismans, ItemCategory.Talismans],
	[UIItemCategory.Tears, ItemCategory.Tears],
	[UIItemCategory.Spirits, ItemCategory.Spirits],
	[UIItemCategory.Classes, ItemCategory.Classes],
]);
