import { ItemCategory, UIItemCategory, UIItemCategories } from "../types/enums";
import { Item } from "./Item";
import data from "../data/data.json";
import { ArmorCategories } from "@/types/constants";

/**
 * Represents a generated build.
 */
export class Build {
	_uiItems = new Map<UIItemCategory, number[]>();
	_items = new Map<ItemCategory, number[]>();

	constructor() {}

	/**
	 * Adds an item to the build.
	 *
	 * @param type the type of item.
	 * @param item the index of the item to add.
	 */
	public addItem(category: ItemCategory, item: number) {
		this._items.set(category, [...(this._items.get(category) ?? []), item]);
		if (ArmorCategories.has(category)) {
			this._uiItems.set(UIItemCategory.Armors, [...(this._uiItems.get(UIItemCategory.Armors) ?? []), item]);
			this.sortArmor();
		} else {
			this._uiItems.set(category as unknown as UIItemCategory, [
				...(this._uiItems.get(category as unknown as UIItemCategory) ?? []),
				item,
			]);
		}
	}

	private sortArmor() {
		this._uiItems.set(UIItemCategory.Armors, []);
		for (const c in ArmorCategories) {
			if (this._items.get(c as ItemCategory)?.length !== 0) {
				this._uiItems.set(UIItemCategory.Armors, [
					...(this._uiItems.get(UIItemCategory.Armors) ?? []),
					this._items.get(c as ItemCategory)![0],
				]);
			}
		}
	}

	/**
	 * Replaces an item in the specified category with a new item.
	 *
	 * @param {ItemCategory} category - The category of the item.
	 * @param {number} oldItem - The index of the item to be replaced.
	 * @param {number} newItem - The index of the new item to replace the old item.
	 * @throws {Error} Throws an error if the item list for the specified category is empty.
	 */
	public replaceItem(category: ItemCategory, oldItem: number, newItem: number) {
		const oldItems = this._items.get(category) ?? [];

		if (oldItems.length === 0) {
			throw new Error("Cannot replace item because the item list is empty.");
		}

		oldItems[oldItems.indexOf(oldItem)] = newItem;
		this._items.set(category, oldItems);
		if (ArmorCategories.has(category)) {
			this._uiItems.set(UIItemCategory.Armors, [...(this._uiItems.get(UIItemCategory.Armors) ?? []), ...oldItems]);
			this.sortArmor();
		} else {
			this._uiItems.set(category as unknown as UIItemCategory, oldItems);
		}
	}

	/**
	 * Returns a Map of ItemCategory to an array of Item objects representing the items in the build.
	 *
	 * @return {Map<UIItemCategory, Item[]>} A Map with ItemCategory as the key and an array of Item objects as the value.
	 */
	public getBuild(): Map<UIItemCategory, Item[]> {
		const categoryMap = new Map();
		categoryMap.set(ItemCategory.Weapons, UIItemCategory.Weapons);
		categoryMap.set(ItemCategory.Ashes, UIItemCategory.Ashes);
		categoryMap.set(ItemCategory.Seals, UIItemCategory.Seals);
		categoryMap.set(ItemCategory.Incants, UIItemCategory.Incants);
		categoryMap.set(ItemCategory.Staves, UIItemCategory.Staves);
		categoryMap.set(ItemCategory.Sorcs, UIItemCategory.Sorcs);
		categoryMap.set(ItemCategory.Shields, UIItemCategory.Shields);
		categoryMap.set(ItemCategory.Tears, UIItemCategory.Tears);
		categoryMap.set(ItemCategory.Spirits, UIItemCategory.Spirits);
		categoryMap.set(ItemCategory.Classes, UIItemCategory.Classes);
		categoryMap.set(ItemCategory.Talismans, UIItemCategory.Talismans);
		const items = new Map<ItemCategory, Item[]>();

		this._items.forEach((value, key) => {
			items.set(key, []);
			value.forEach((index) => {
				if (!Object.values(ItemCategory).includes(key)) return;

				const item = new Item(key, data[key as keyof typeof data].items[index], index);
				items.set(key, [...(items.get(key) ?? []), item]);
			});
		});

		const uiItems = new Map<UIItemCategory, Item[]>();

		const armors: Item[] = [];
		for (const [key, value] of items) {
			if (!ArmorCategories.has(key)) {
				uiItems.set(categoryMap.get(key), value);
			} else {
				armors.push(...value);
			}
		}

		armors.length > 0 && uiItems.set(UIItemCategory.Armors, armors);
		const build = new Map<UIItemCategory, Item[]>();

		for (const c of UIItemCategories) {
			const categoryItems = uiItems.get(c as unknown as UIItemCategory);
			if (typeof categoryItems === "undefined") continue;

			build.set(c as unknown as UIItemCategory, categoryItems);
		}

		return build;
	}

	public getItems() {
		const buildMap = new Map<ItemCategory, Item[]>();

		this._items.forEach((value, key) => {
			buildMap.set(key, []);
			value.forEach((index) => {
				if (!Object.values(ItemCategory).includes(key)) return;

				const item = new Item(key, data[key as keyof typeof data].items[index], index);
				buildMap.set(key, [...(buildMap.get(key) ?? []), item]);
			});
		});

		return buildMap;
	}
}
