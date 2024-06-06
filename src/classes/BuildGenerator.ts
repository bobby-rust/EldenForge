import { BuildGenerationConfig, ItemData, defaultBuildGenerationConfig } from "../types/types";
import data from "../data/new_data.json";
import { ItemCategory } from "../types/enums";
import { Build } from "./Build";
import { Item } from "./Item";

/**
 * The BuildGenerator needs to generate a valid build and return a base64 encoded
 * URL parameter string of the form
 * ?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...
 *
 * This object will also keep track of the state of generated items
 * and a boolean flag `_excludePreviouslyRolled`
 * which are used to determine if generated items are valid.
 * If a generated item is not valid (i.e. _excludePreviouslyRolled is false and the item has already been generated),
 * it will keep regenerating items until a valid item is found or there are no more valid items.
 */
export default class BuildGenerator extends Build {
	private static instance: BuildGenerator;

	_itemData: ItemData = data;
	_buildGenerationConfig: BuildGenerationConfig = structuredClone(defaultBuildGenerationConfig);

	constructor() {
		super();
		if (!BuildGenerator.instance) {
			BuildGenerator.instance = this;
		} else {
			return BuildGenerator.instance;
		}
	}

	/**
	 * Generates a URL representing a build.
	 * The build contains unique items if _excludePreviouslyRolled is false.
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	public generateUrl(): string {
		return this.generateRandom();
	}

	private resetItems() {
		this._items = new Map<ItemCategory, number[]>();
	}

	public rerollItem(category: ItemCategory, oldItem: number): Map<ItemCategory, number[]> {
		const newItem = this.generateItem(category);
		if (typeof newItem === "undefined") return this._items;
		console.log("Got new item: ", newItem);
		this.replaceItem(category, oldItem, newItem);

		return this._items;
	}

	/**
	 * Generates a Build object from a base64 encoded URL.
	 * @param encoded The base64 encoded url.
	 * @returns {Build} A build object containing the items of `encoded`
	 */
	public generateBuildFromUrl(encoded: string): Map<ItemCategory, Item[]> {
		// const url = this.decode(encoded);
		const url = encoded;
		const buildMap = this.parseBuildMapFromUrl(url);
		const build: Map<ItemCategory, Item[]> = this.parseBuildFromMap(buildMap);
		return build;
	}

	/**
	 * Gets the index of the item by its name, or -1 if the item was not found.
	 * @param type the type of item to retrieve
	 * @param name the name of the item
	 * @returns {number} the index of the item in the raw data
	 */
	public getItemFromName(type: string, name: string): number {
		const items = data[type as keyof typeof data]["items"];

		items.forEach((item, i) => {
			if (item.name === name) {
				return i;
			}
		});

		return -1;
	}

	/**
	 * Generates a random index of an item from a given category.
	 * If `_excludePreviouslyRolled` is true, it generates an index of an unrolled item.
	 *
	 * @param {ItemCategory} category - The category of the item to generate.
	 * @returns {number} - The index of the generated item.
	 *                     -1 if all items in the category have been rolled.
	 */
	public generateItem(category: ItemCategory): number | undefined {
		// Get the count of items in the category
		const count = this._itemData[category]["count"];

		// Generate a random index between 0 and count - 1
		let randomIndex = Math.floor(Math.random() * count);

		// Get the set of previously rolled items for the category
		const prevRolledItems = this._buildGenerationConfig[category].previouslyRolled;

		// If all items in the category have been rolled, return -1
		if (prevRolledItems.size >= count) {
			return;
		}

		// If `_excludePreviouslyRolled` is true and the generated index is of a previously rolled item,
		// generate a new index until an unrolled item is found.
		while (this._buildGenerationConfig[category].excludePreviouslyRolled && prevRolledItems.has(randomIndex)) {
			randomIndex = Math.floor(Math.random() * count);
		}

		// Add the generated index to the set of previously rolled items
		this.addItemToPreviouslyRolled(category, randomIndex);

		// Return the generated index
		return randomIndex;
	}

	public getBuildNumsForCategory(category: ItemCategory) {
		return this._buildGenerationConfig[category].buildNums;
	}

	public setBuildNumsForCategory(category: ItemCategory, buildNums: number) {
		this._buildGenerationConfig[category].buildNums = buildNums;
	}

	private getPreviouslyRolledForCategory(category: ItemCategory) {
		return this._buildGenerationConfig[category].previouslyRolled;
	}

	/**
	 * Retrieves the value of the `excludePreviouslyRolled` property for the specified `category` from the `_buildGenerationConfig` object.
	 *
	 * @param {ItemCategory} category - The category for which to retrieve the `excludePreviouslyRolled` property.
	 * @return {boolean} The value of the `excludePreviouslyRolled` property for the specified `category`.
	 */
	public getExcludePreviouslyRolledForCategory(category: ItemCategory) {
		return this._buildGenerationConfig[category].excludePreviouslyRolled;
	}

	/**
	 * Sets the value of `excludePreviouslyRolled` in the `_buildGenerationConfig` object for the given `category`.
	 *
	 * @param {ItemCategory} category - The category for which to set the value.
	 * @param {boolean} exclude - The new value for `excludePreviouslyRolled`.
	 */
	public setExcludePreviouslyRolledForCategory(category: ItemCategory, exclude: boolean) {
		this._buildGenerationConfig[category].excludePreviouslyRolled = exclude;
		!exclude ? this._buildGenerationConfig[category].previouslyRolled.clear() : null;
	}

	/**
	 * Converts a Map representing a build into a base64 encoded string
	 *
	 * @param rolled A Map containing categories as keys and the indices of build items as values
	 * @returns {string} A base64 encoded ASCII string of the form
	 *                   `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 */
	public createUrlFromBuildMap(rolled: Map<ItemCategory, number[]>): string {
		let url = "";
		for (const category of rolled.keys()) {
			url += `&${category}=`;

			// IDK why TypeScript finds this necessary, rolled CLEARLY has category as we are LOOPING OVER ITS KEYS
			const items = rolled.get(category) ?? [];

			items.forEach((num, i) => {
				if (typeof num === "undefined") {
					return;
				}
				url += i === items.length - 1 ? num.toString() : num.toString() + ",";
			});
		}

		url = url.slice(0, url.length); // remove last comma
		return url;
		// return this.encode(url);
	}

	/**
	 * Generates a random build of items
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	private generateRandom(): string {
		/**
		 * Maps the category to the indices of the items rolled for that category for the current build
		 */
		const buildMap: Map<ItemCategory, number[]> = new Map<ItemCategory, number[]>();

		for (const category of Object.keys(this._itemData)) {
			const numItemsToRoll = this._buildGenerationConfig[category].buildNums;
			buildMap.set(category as ItemCategory, []);
			for (let i = 0; i < numItemsToRoll; ++i) {
				const itemIndex = this.generateItem(category as ItemCategory);
				if (typeof itemIndex === "undefined") {
					continue;
				}
				this.addItemToBuildMap(category as ItemCategory, itemIndex, buildMap);
			}
		}

		return this.createUrlFromBuildMap(buildMap);
	}

	private addItemToBuildMap(category: ItemCategory, item: number, map: Map<ItemCategory, number[]>) {
		/**
		 * This is needed because Map and Set's get method can return undefined,
		 * in which case a new Map or Set needs to be initialized in order for an item to be added
		 */
		map.set(category, [...(map.get(category) ?? []), item]); // add item to current rolled items
	}

	/**
	 * Adds an item to the list of previously rolled items.
	 * @param category the category of item
	 * @param item the index of the item
	 */
	private addItemToPreviouslyRolled(category: ItemCategory, item: number) {
		this._buildGenerationConfig[category].previouslyRolled.add(item);
	}

	/**
	 * Parses a Build from a build map where the keys are the category
	 * and the values are the list of indices of items for that category.
	 * @param map the build map to parse.
	 * @returns {Build} the Build object.
	 */
	private parseBuildFromMap(map: Map<ItemCategory, number[]>): Map<ItemCategory, Item[]> {
		this.resetItems();
		for (const [key, val] of map) {
			val.forEach((val: number) => {
				if (isNaN(val)) {
					return;
				}
				this.addItem(key, val);
			});
		}

		return this.getItemsFromBuild();
	}

	/**
	 * Gets an item object from its type and index.
	 * @param type the type of item
	 * @param index the index of the item in the raw data
	 * @returns {Item | Armor} the item.
	 */
	// private getItem(type: ItemCategory, index: number): Item {
	// 	const itemData = data[type as keyof typeof data].items[index]; // Just pleasing TypeScript...
	// 	const item = new Item(type, itemData, index);

	// 	return item;
	// }

	/**
	 * Parses a string of the form `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a build map containing categories as keys and the indices of build items as values
	 */
	private parseBuildMapFromUrl(str: string): Map<ItemCategory, number[]> {
		const buildMap = new Map<ItemCategory, number[]>();

		for (let i = 0; i < str.length; ++i) {
			// If we are at an ampersand, slice out the entire category.
			if (str[i] === "&") {
				let catStart = i + 1;
				let catStop = catStart;

				for (let j = catStart; j < str.length; ++j) {
					if (str[j] === "&") {
						catStop = j; // string.slice takes up to but NOT including as second parameter
						break;
					}
					if (j === str.length - 1) {
						catStop = str.length;
						break;
					}
				}

				const category = str.slice(catStart, catStop); // this is the entire category including key and values

				// once we have the entire category, split by the "=" to find the name and values
				const items = category.split("=");
				const categoryName = items[0] as ItemCategory;
				const values = items[1].split(",");
				if (values[0] === "") {
					buildMap.set(categoryName, []);
					continue;
				}
				const intVals: number[] = [];
				values.forEach((val) => {
					const num = parseInt(val);
					if (isNaN(num)) {
						return;
					}
					intVals.push(num);
				});
				buildMap.set(categoryName, intVals);
			}
		}

		return buildMap;
	}

	// // Converts an ASCII string to a Base64 encoded string
	// private encode(str: string): string {
	// 	return btoa(str);
	// }

	// // Converts a Base64 encoded string to ASCII
	// private decode(str: string): string {
	// 	return atob(str);
	// }
}
