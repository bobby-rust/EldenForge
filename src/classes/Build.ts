import { ItemCategory } from "../types/enums";
import { Item } from "./Item";
import data from "../data/new_new_data.json";

/**
 * Represents a generated build.
 */
export class Build {
	_items = new Map<ItemCategory, number[]>();

	constructor() {}

	/**
	 * Adds an item to the build.
	 * @param type the type of item.
	 * @param item the index of the item to add.
	 */
	public addItem(category: ItemCategory, item: number) {
		this._items.set(category, [...(this._items.get(category) ?? []), item]);
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
	}

	/**
	 * Returns a Map of ItemCategory to an array of Item objects representing the items in the build.
	 *
	 * @return {Map<ItemCategory, Item[]>} A Map with ItemCategory as the key and an array of Item objects as the value.
	 */
	public getItemsFromBuild(): Map<ItemCategory, Item[]> {
		const items = new Map<ItemCategory, Item[]>();

		this._items.forEach((value, key) => {
			items.set(key, []);
			value.forEach((index) => {
				if (index === -1) return;
				if (!Object.values(ItemCategory).includes(key)) return;

				const item = new Item(key, data[key as keyof typeof data].items[index], index);
				items.set(key, [...(items.get(key) ?? []), item]);
			});
		});

		return items;
	}
}
