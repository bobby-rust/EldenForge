import { BuildNums, ExcludePreviuouslyRolled, ItemData } from "../types/types";
import data from "../data/new_data.json";
import { ItemCategory } from "../types/enums";
import { Build } from "./Build";
import { Item } from "./Item";

/**
 * NOTE: Consider breaking this class up into two children classes, AIGenerator and RandomGenerator instead of one monolithic class
 *
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
export default class BuildGenerator {
	_itemData: ItemData = data;
	_excludePreviouslyRolled: ExcludePreviuouslyRolled = {
		helms: true,
		chests: true,
		gauntlets: true,
		legs: true,
		classes: true,
		ashes: true,
		tears: true,
		incants: true,
		seals: true,
		shields: true,
		sorcs: true,
		spirits: true,
		talismans: true,
		weapons: true,
	};

	/**
	 * Maps the category to the indices of the rolled items in that category for all builds.
	 * The value is a Set for more efficient access of numbers
	 */
	_previouslyRolled: Map<ItemCategory, Set<number>> = new Map<ItemCategory, Set<number>>();
	_buildNums: BuildNums = {
		helms: 1,
		chests: 1,
		gauntlets: 1,
		legs: 1,
		classes: 1,
		ashes: 2,
		tears: 2,
		incants: 2,
		seals: 2,
		shields: 2,
		sorcs: 2,
		spirits: 2,
		talismans: 2,
		weapons: 2,
	};

	constructor() {
		console.log("Initialized new build generator");
	}

	/**
	 * Generates a URL representing a build.
	 * The build contains unique items if _excludePreviouslyRolled is false.
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	public generateUrl(): string {
		return this.generateRandom();
	}

	public rerollItem(build: Build, category: ItemCategory, oldItem: number) {
		const newItem = this.generateItem(category);
		build.replaceItem(category, oldItem, newItem);
	}

	/**
	 * Generates a Build object from a base64 encoded URL.
	 * @param encoded The base64 encoded url.
	 * @returns {Build} A build object containing the items of `encoded`
	 */
	public generateBuildFromUrl(encoded: string): Build {
		const url = this.decode(encoded);

		const buildMap = this.parseBuildMapFromUrl(url);
		const build: Build = this.parseBuildFromMap(buildMap);

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
	public generateItem(category: ItemCategory): number {
		// Get the count of items in the category
		const count = this._itemData[category]["count"];

		// Generate a random index between 0 and count - 1
		let randomIndex = Math.floor(Math.random() * count);

		// Get the set of previously rolled items for the category
		const prevRolledItems = this._previouslyRolled.get(category) ?? new Set<number>();

		// If all items in the category have been rolled, return -1
		if (prevRolledItems.size >= count) {
			return -1;
		}

		// If `_excludePreviouslyRolled` is true and the generated index is of a previously rolled item,
		// generate a new index until an unrolled item is found.
		while (this._excludePreviouslyRolled[category] && prevRolledItems.has(randomIndex)) {
			randomIndex = Math.floor(Math.random() * count);
		}

		// Add the generated index to the set of previously rolled items for the category
		prevRolledItems.add(randomIndex);

		// Update the set of previously rolled items for the category
		this._previouslyRolled.set(category, prevRolledItems);

		// Return the generated index
		return randomIndex;
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
			const numItemsToRoll = this._buildNums[category];

			for (let i = 0; i < numItemsToRoll; ++i) {
				const itemIndex = this.generateItem(category as ItemCategory);
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

		this.addItemToPreviouslyRolled(category, item);
		map.set(category, [...(map.get(category) ?? []), item]); // add item to current rolled items
	}

	/**
	 * Adds an item to the list of previously rolled items.
	 * @param category the category of item
	 * @param item the index of the item
	 */
	private addItemToPreviouslyRolled(category: ItemCategory, item: number) {
		const newItems = (this._previouslyRolled.get(category) ?? new Set<number>()).add(item); // add item to previously rolled
		this._previouslyRolled.set(category, newItems);
	}

	/**
	 * Parses a Build from a build map where the keys are the category
	 * and the values are the list of indices of items for that category.
	 * @param map the build map to parse.
	 * @returns {Build} the Build object.
	 */
	private parseBuildFromMap(map: Map<ItemCategory, number[]>): Build {
		const build = new Build();

		for (const [key, val] of map) {
			val.forEach((val: number) => {
				if (isNaN(val)) {
					console.log("WHY ME");
					return;
				}
				build.addItem(key, val);
			});
		}

		return build;
	}

	/**
	 * Gets an item object from its type and index.
	 * @param type the type of item
	 * @param index the index of the item in the raw data
	 * @returns {Item | Armor} the item.
	 */
	private getItem(type: ItemCategory, index: number): Item {
		const itemData = data[type as keyof typeof data].items[index]; // Just pleasing TypeScript...
		const item = new Item(type, itemData, index);

		return item;
	}

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
				const intVals: number[] = [];
				values.forEach((val) => {
					const num = parseInt(val);
					if (isNaN(num)) {
						console.log("Val is NaN: ", val);
						console.log("Current items: ", items);
						console.log("While parsing URL: ", str);
						console.log("Current Category: ", category);
					}
					intVals.push(num);
				});
				buildMap.set(categoryName, intVals);
			}
		}

		return buildMap;
	}

	// Converts an ASCII string to a Base64 encoded string
	private encode(str: string): string {
		return btoa(str);
	}

	// Converts a Base64 encoded string to ASCII
	private decode(str: string): string {
		return atob(str);
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
				url += i === items.length - 1 ? num.toString() : num.toString() + ",";
			});
		}

		url = url.slice(0, url.length); // remove last comma
		return this.encode(url);
	}
}
