import { AIBuildType, BuildGenerationConfig, ItemData, Items, defaultBuildGenerationConfig } from "../types/types";
import data from "../data/data.json";
import { ItemCategory, UIItemCategory } from "../types/enums";
import { Build } from "./Build";
import { Item } from "./Item";
import AIGenerator from "./AIGenerator";
import { NUM_SOTE_ITEMS } from "@/types/constants";

/**
 * The BuildGenerator needs to generate a valid build and return
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
	_buildGenerationConfig: BuildGenerationConfig = structuredClone(defaultBuildGenerationConfig);
	_build: Build = new Build();
	_ai: AIGenerator | undefined;
	_baseGameItems: Items = this.initBaseGameItems();
	_dlcItems: Items = this.initDlcItems();

	private _buildType = "";

	constructor() {}

	/**
	 * Sets the build type.
	 *
	 * @param {string} buildType - The type of Elden Ring build to generate. Ex. "Magic Damage", "Fire Damage", etc.
	 */
	set buildType(buildType: string) {
		this._buildType = buildType;
	}

	/**
	 * Sets the AI generator.
	 *
	 * @param {AIGenerator} ai - The AI generator to use for generating builds.
	 */
	set ai(ai: AIGenerator) {
		this._ai = ai;
	}

	/**
	 * Generates a URL representing a build.
	 * The build contains unique items if _excludePreviouslyRolled is false.
	 * @returns {string} URL parameters representing a build. See class header for more information.
	 */
	public generateUrl(): string {
		return this.generateRandom();
	}

	/**
	 * Generates a URL representing an AI build. Uses Google Gemini.
	 *
	 * @param {AbortSignal} signal - The signal to abort the AI generation request.
	 * @returns {Promise<string | null>} A promise that resolves to the generated URL or null if there was an error.
	 */
	public async generateAIUrl(signal: AbortSignal): Promise<string | null> {
		if (typeof this._ai === "undefined") {
			this.ai = new AIGenerator();
		}

		let build;
		try {
			build = await this._ai?.getAIBuild(this._buildType, signal);
		} catch (e) {
			// TODO: generate useful error messages and error page for user, this error is likely to be an exhausted quota error from gemini
			console.error(e);
		}
		if (!build) return null;

		return this.createAIUrlFromAIBuild(build);
	}

	/**
	 * Sets the number of items for a given category in the build generation configuration.
	 *
	 * @param {ItemCategory} category - The category of items to set the number for.
	 * @param {number} numItems - The number of items to set for the category.
	 * @return {void}
	 */
	public setNumItems(category: ItemCategory, numItems: number): void {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums = numItems;
	}

	/**
	 * Enables the generation of a category in the build generation configuration.
	 *
	 * @param {ItemCategory} category - The category to enable.
	 * @return {void}
	 */
	public enableCategory(category: ItemCategory): void {
		this._buildGenerationConfig.buildInfo.enabledCategories.add(category);
	}

	/**
	 * Disables the generation of a category in the build generation configuration.
	 *
	 * @param {ItemCategory} category - The category to disable.
	 * @return {void}
	 */
	public disableCategory(category: ItemCategory): void {
		this._buildGenerationConfig.buildInfo.enabledCategories.delete(category);
	}

	private generateArmors() {
		let newBuild;
		for (const c in [ItemCategory.Helm, ItemCategory.Chest, ItemCategory.Gauntlets, ItemCategory.Leg]) {
			newBuild = this.generateItemsForItemCategory(c as ItemCategory);
		}

		return newBuild;
	}

	/**
	 * Generates and adds items for a specific item category to the build.
	 *
	 * @param {ItemCategory} category - The category for which items are generated.
	 * @return {Map<ItemCategory, number[]>} The updated map of item category to item indices in the build.
	 */
	private generateItemsForItemCategory(category: ItemCategory) {
		// If there are items for the category, they will be reset.
		this._build._items.set(category, []);

		// Reset the number of items to generate and the available items
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums = defaultBuildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums;
		this._baseGameItems = { ...this._baseGameItems, [category]: this.initBaseGameItems()[category] }; // reset base game items for the category
		this._dlcItems = { ...this._dlcItems, [category]: this.initDlcItems()[category] };

		const numItemsToRoll = defaultBuildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums;
		for (let i = 0; i < numItemsToRoll; i++) {
			const item = this.generateItem(category);
			if (typeof item === "undefined") {
				break; // all items in the category have been rolled
			}
			this._build.addItem(category, item);
		}

		return this._build._items;
	}

	/**
	 * Generates items for a given category. Generates the default number of items
	 * specified in the default build generation configuration.
	 * This function should only be called when the build has no items for the category.
	 * If there are items for the category, they will be reset.
	 *
	 * @param {ItemCategory} category - The category of items to generate.
	 * @return {Map<ItemCategory, number[]>} - The entire new build map
	 */
	public generateItemsForCategory(category: ItemCategory | UIItemCategory) {
		if (category === UIItemCategory.Armors) {
			return this.generateArmors();
		}

		const itemCategory = category as ItemCategory;
		return this.generateItemsForItemCategory(itemCategory);
	}

	/**
	 * Resets the available items for a given category.
	 *
	 * @param {ItemCategory} c - The category for which to reset the available items.
	 */
	public resetAvailableItemsForCategory(c: ItemCategory) {
		// Empty the list of available items if not already empty
		this._baseGameItems[c] = [];
		this._dlcItems[c] = [];

		// Populate the lists of available items
		const numBaseGameItems = data[c]["count"] - NUM_SOTE_ITEMS[c];
		for (let i = 0; i < numBaseGameItems; i++) {
			this._baseGameItems[c].push(i);
		}

		for (let j = numBaseGameItems; j < data[c]["count"]; j++) {
			this._dlcItems[c].push(j);
		}
	}

	/**
	 * Creates a URL string from an AI build object.
	 *
	 * @param {AIBuildType} build - The AI build object to create the URL from.
	 * @return {string} The URL string created from the AI build object.
	 */
	private createAIUrlFromAIBuild(build: AIBuildType): string {
		// Create a map of item categories to an array of item indices.
		const buildMap = new Map<ItemCategory, number[]>();

		// Iterate over each item category in the AI build.
		build.items.forEach((value, _) => {
			// For each item in the category, if it has a valid index, add it to the build map.
			value.forEach((item) => {
				let itemCategory = item.category;

				if (typeof item.index === "undefined") return;

				this.addItemToBuildMap(itemCategory, item.index, buildMap);
			});
		});

		// Create a URL string from the build map.
		let url = this.createUrlFromBuildMap(buildMap);

		// Append the non-item categories from the AI build to the URL string.
		for (const category of Object.keys(build)) {
			// Skip the "items" category.
			if (category === "items") continue;
			url += `&${category}=${build[category]}`;
		}

		return url;
	}

	/**
	 * Resets the items map in the build to an empty map.
	 */
	private resetItems() {
		this._build._items = new Map<ItemCategory, number[]>();
	}

	/**
	 * Rerolls an item in the specified category and replaces the item with index `oldItem` with the new item.
	 *
	 * @param {ItemCategory} category - The category of the item to reroll.
	 * @param {number} oldItem - The index of the item to be replaced.
	 * @return {Map<ItemCategory, number[]> | undefined} The updated items map after rerolling the item, or undefined if the new item is not generated successfully.
	 */
	public rerollItem(category: ItemCategory, oldItem: number): Map<ItemCategory, number[]> | undefined {
		const newItem = this.generateItem(category);

		if (typeof newItem === "undefined") return;
		this._build.replaceItem(category, oldItem, newItem);

		return this._build._items;
	}

	/**
	 * Generates a Build object from a base64 encoded URL.
	 * @param encoded The base64 encoded url.
	 * @returns {Build} A build object containing the items of `encoded`
	 */
	public generateBuildFromUrl(encoded: string): Map<UIItemCategory, Item[]> {
		if (encoded === "") return new Map<UIItemCategory, Item[]>();
		const url = encoded;
		const buildMap = this.parseBuildMapFromUrl(url);

		this.addItemsToBuild(buildMap);

		const build: Map<UIItemCategory, Item[]> = this.getBuild();

		return build;
	}

	/**
	 * Sets the value of the `includeDlc` property in the `_buildGenerationConfig` object.
	 *
	 * @param {boolean} includeDlc - The new value for the `includeDlc` property.
	 * @return {void} This function does not return a value.
	 */
	public setIncludeDlc(includeDlc: boolean) {
		this._buildGenerationConfig.includeDlc = includeDlc;
	}

	/**
	 * Calculates the count of items in a given category.
	 * If `includeDlc` is true, it returns the count of all items in the category.
	 * Otherwise, it returns the count of items in the category excluding DLC items.
	 *
	 * @param {ItemCategory} category - The category of the items to calculate count for.
	 * @returns {number} - The count of items in the category.
	 */
	private calculateCount(category: ItemCategory): number {
		if (category === "classes") return 0;
		// If `includeDlc` is true, return the count of all items in the category

		return this._buildGenerationConfig.includeDlc ? this._baseGameItems[category].length + this._dlcItems[category].length : this._baseGameItems[category].length;
	}

	public initBaseGameItems(): Items {
		const baseGameItems: Items = {
			[ItemCategory.Helm]: [],
			[ItemCategory.Chest]: [],
			[ItemCategory.Gauntlets]: [],
			[ItemCategory.Leg]: [],
			[ItemCategory.Weapons]: [],
			[ItemCategory.Staves]: [],
			[ItemCategory.Sorcs]: [],
			[ItemCategory.Talismans]: [],
			[ItemCategory.Spirits]: [],
			[ItemCategory.Shields]: [],
			[ItemCategory.Seals]: [],
			[ItemCategory.Tears]: [],
			[ItemCategory.Ashes]: [],
			[ItemCategory.Incants]: [],
		};

		for (const [key, val] of Object.entries(baseGameItems)) {
			for (let i = 0; i < data[key as ItemCategory]["count"] - NUM_SOTE_ITEMS[key]; ++i) {
				val.push(i);
			}
		}

		return baseGameItems;
	}

	public initDlcItems(): Items {
		const dlcItems: Items = {
			[ItemCategory.Helm]: [],
			[ItemCategory.Chest]: [],
			[ItemCategory.Gauntlets]: [],
			[ItemCategory.Leg]: [],
			[ItemCategory.Weapons]: [],
			[ItemCategory.Staves]: [],
			[ItemCategory.Sorcs]: [],
			[ItemCategory.Talismans]: [],
			[ItemCategory.Spirits]: [],
			[ItemCategory.Shields]: [],
			[ItemCategory.Seals]: [],
			[ItemCategory.Tears]: [],
			[ItemCategory.Ashes]: [],
			[ItemCategory.Incants]: [],
		};

		for (const [key, val] of Object.entries(dlcItems)) {
			for (let i = data[key as ItemCategory]["count"] - NUM_SOTE_ITEMS[key]; i < data[key as ItemCategory]["count"]; ++i) {
				val.push(i);
			}
		}

		return dlcItems;
	}

	private getRandomIndex(category: ItemCategory): { localIndex: number; dataItemIndex: number } | undefined {
		const count = this.calculateCount(category);
		if (count === 0) return;

		// The random index is an index of the available items, it is __not__ the index of the item in the raw data
		let localIndex = Math.floor(Math.random() * count);
		while (
			// This first condition should NOT be necessary to check, but it's here as an additional backup measure to prevent an infinite loop
			!this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)?.excludePreviouslyRolled &&
			this._build._items.get(category)?.includes(localIndex)
		) {
			localIndex = Math.floor(Math.random() * count);
		}

		let adjustedLocalIndex = localIndex;
		let dataItemIndex = -1;
		if (localIndex > this._baseGameItems[category].length - 1) {
			adjustedLocalIndex = localIndex - this._baseGameItems[category].length;
			dataItemIndex = this._dlcItems[category][adjustedLocalIndex];
		} else {
			dataItemIndex = this._baseGameItems[category][adjustedLocalIndex];
		}

		return { localIndex: localIndex, dataItemIndex: dataItemIndex };
	}

	/**
	 * Generates a random index of an item from a given category.
	 * If `_excludePreviouslyRolled` is true, it generates an index of an unrolled item.
	 *
	 * @param {ItemCategory} category - The category of the item to generate.
	 * @returns {number | undefined} - The index of the generated item or undefined if all items in the category have been rolled.
	 */
	public generateItem(category: ItemCategory): number | undefined {
		let indices = this.getRandomIndex(category);
		if (typeof indices === "undefined") return;

		while (
			// This first condition should not be necessary to check, but it's here as an additional backup measure to prevent an infinite loop
			!this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)?.excludePreviouslyRolled &&
			this._build._items.get(category)?.includes(indices.dataItemIndex)
		) {
			indices = this.getRandomIndex(category);
			if (typeof indices === "undefined") return;
		}

		// This function will not add the item if excludePreviouslyRolled is false, so we don't have to check here
		this.removeItemFromAvailableItems(category, indices?.localIndex);

		// Return the generated index
		return indices.dataItemIndex;
	}

	/**
	 * Retrieves the number of items to be generated for a given category from the build generation configuration.
	 *
	 * @param {ItemCategory} category - The category for which to retrieve the number of items.
	 * @return {number} The number of items to be generated for the specified category.
	 */
	public getBuildNumsForCategory(category: ItemCategory) {
		return this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums;
	}

	/**
	 * Sets the number of items to be generated for a given category in the build generation configuration.
	 *
	 * @param {ItemCategory} category - The category of items to set the build numbers for.
	 * @param {number} buildNums - The number of items to set for the category.
	 */
	public setBuildNumsForCategory(category: ItemCategory, buildNums: number) {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums = buildNums;
	}

	/**
	 * Retrieves the value of the `excludePreviouslyRolled` property for the specified `category` from the `_buildGenerationConfig` object.
	 *
	 * @param {ItemCategory} category - The category for which to retrieve the `excludePreviouslyRolled` property.
	 * @return {boolean} The value of the `excludePreviouslyRolled` property for the specified `category`.
	 */
	public getExcludePreviouslyRolledForCategory(category: ItemCategory) {
		return this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled;
	}

	/**
	 * Sets the value of `excludePreviouslyRolled` in the `_buildGenerationConfig` object for the given `category`.
	 * If `exclude` is false, it also clears the set of previously rolled items for the specified `category`.
	 *
	 * @param {ItemCategory} category - The category for which to set the value.
	 * @param {boolean} exclude - The new value for `excludePreviouslyRolled`.
	 */
	public setExcludePreviouslyRolledForCategory(category: ItemCategory, exclude: boolean) {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled = exclude;
		!exclude && this.resetAvailableItemsForCategory(category);
	}

	/**
	 * Converts a Map representing a build into a url parameter string
	 *
	 * @param rolled A Map containing categories as keys and the indices of build items as values
	 * @returns {string} A url parameter string of the form
	 *                   `?weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 */
	public createUrlFromBuildMap(rolled: Map<ItemCategory, number[]>): string {
		let url = "";
		let first = true;
		for (const category of rolled.keys()) {
			url += first ? `?${category}=` : `&${category}=`;
			first = false;

			// IDK why TypeScript finds this necessary, rolled CLEARLY has category as we are LOOPING OVER ITS KEYS (ts 5.5 save me)
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
	}

	/**
	 * Generates a random build of items and returns a url parameter string representing the build.
	 *
	 * This function will generate a random build of items and return a url parameter string
	 * of the form `?weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * representing the build. The build will contain the specified number of items for each category.
	 *
	 * @returns {string} url parameters representing a build. See class header for more information.
	 */
	private generateRandom(): string {
		// Reset the build and the map of rolled items before generating a new build
		this.resetItems();

		/**
		 * Maps the category to the indices of the items rolled for that category for the current build
		 */
		const buildMap = new Map<ItemCategory, number[]>();

		// Loop over all categories and generate the specified number of items for each category
		for (const category of Object.keys(this._itemData)) {
			// initialize the array of rolled items for the current category
			buildMap.set(category as ItemCategory, []);

			// Do not generate items for disabled categories
			if (!this._buildGenerationConfig.buildInfo.enabledCategories.has(category as ItemCategory)) continue;

			const numItemsToRoll = this.getBuildNumsForCategory(category as ItemCategory);
			for (let i = 0; i < numItemsToRoll; ++i) {
				const itemIndex = this.generateItem(category as ItemCategory);
				if (typeof itemIndex === "undefined") {
					// If the item index is undefined, it means all items in the category have been rolled,
					// so break out of the loop and move on to the next category
					continue;
				}

				this.addItemToBuildMap(category as ItemCategory, itemIndex, buildMap);
				this._build.addItem(category as ItemCategory, itemIndex);
			}
		}

		// Convert the map of rolled items to a url parameter string and return it
		return this.createUrlFromBuildMap(buildMap);
	}

	/**
	 * Adds an item to the build map for a given category.
	 *
	 * @param {ItemCategory} category - The category of the item.
	 * @param {number} item - The index of the item.
	 * @param {Map<ItemCategory, number[]>} map - The map of categories to rolled items.
	 * @returns {void}
	 */
	private addItemToBuildMap(category: ItemCategory, item: number, map: Map<ItemCategory, number[]>): void {
		/**
		 * This is needed because Map and Set's get method can return undefined,
		 * in which case a new Map or Set needs to be initialized in order for an item to be added
		 */
		map.set(category, [...(map.get(category) ?? []), item]); // add item to current rolled items
	}

	/**
	 * Adds an item to the list of previously rolled items iff `excludePreviouslyRolled` is true.
	 *
	 * @param category the category of item
	 * @param item the index of the item
	 */
	private removeItemFromAvailableItems(category: ItemCategory, localIndex: number) {
		if (!this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled) {
			console.log("no removing item");
			return;
		}

		let adjustedLocalIndex = localIndex;
		if (localIndex > this._baseGameItems[category].length - 1) {
			adjustedLocalIndex -= this._baseGameItems[category].length;
			this._dlcItems[category].splice(adjustedLocalIndex, 1);
		} else {
			this._baseGameItems[category].splice(adjustedLocalIndex, 1);
		}
	}

	/**
	 * Adds items to the list of previously rolled items based on the provided map.
	 *
	 * @param {Map<ItemCategory, number[]>} items - The map containing items to add to the previously rolled items list.
	 * @return {void}
	 */
	// private addItemsToPreviouslyRolled(items: Map<ItemCategory, number[]>) {
	// 	items.forEach((items, category) => {
	// 		items.forEach((item) => {
	// 			this.removeItemFromAvailableItems(category, item);
	// 		});
	// 	});
	// }

	/**
	 * Adds a map of categories to indices to this._build.
	 *
	 * @param {Map<ItemCategory, number[]>} map - The build map to convert.
	 * @returns {Map<ItemCategory, Item[]>} The map of categories to items.
	 */
	public addItemsToBuild(map: Map<ItemCategory, number[]>): void {
		// Reset the items in the build generator before adding items to the build
		this.resetItems();

		/**
		 * For each category, check if there are items to add. If there are, add them to the build
		 * and also add them to the list of previously rolled items if the option is enabled
		 */
		for (const [key, val] of map) {
			// If the category has no items, add an empty list
			if (val.length === 0) {
				this._build._items.set(key, []);
			}

			// Add each item to the build and to the list of previously rolled items
			val.forEach((val: number) => {
				// Add the item to the build
				this._build.addItem(key, val);
			});
		}
	}

	public getBuild(): Map<UIItemCategory, Item[]> {
		return this._build.getBuild();
	}

	public getBuildMap(): Map<ItemCategory, number[]> {
		return this._build._items;
	}

	/**
	 * Parses the URL of an AI-generated build and returns an AI build object.
	 *
	 * @param {string} url - The URL of the AI-generated build.
	 * @return {AIBuildType} The AI build object.
	 */
	public parseAIBuildFromUrl(url: string): AIBuildType {
		// Add the items to the build from the build map
		const buildMap = this.parseBuildMapFromUrl(url);
		this.addItemsToBuild(buildMap);
		const build = this._build.getBuild();
		// Initialize a new build object with default properties
		const aiBuild: AIBuildType = {
			vigor: 0,
			mind: 0,
			endurance: 0,
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			faith: 0,
			arcane: 0,
			name: "",
			summary: "",
			strengths: "",
			weaknesses: "",
			items: build,
		};

		// Get the key-value pairs from the URL
		const keyValues = this.getKeyValuesFromUrl(url);

		// Iterate over the key-value pairs and set the values in the build object
		for (const [key, val] of keyValues) {
			// If the category is an item category, skip it
			if (Object.values(ItemCategory).includes(key as ItemCategory)) continue;

			// Otherwise, set the value in the build object
			if (!key || !val) continue;
			aiBuild[key] = val;
		}

		return aiBuild;
	}

	/**
	 * Retrieves key-value pairs from a URL.
	 *
	 * @param {string} url - The URL to extract key-value pairs from.
	 * @return {Map<string, string>} A map containing the extracted key-value pairs.
	 */
	private getKeyValuesFromUrl(url: string): Map<string, string> {
		const keyValues = new Map<string, string>();
		// Could use 2 pointer solution here, but no need to refactor right now
		for (let i = 0; i < url.length; ++i) {
			// If we are at an ampersand, slice out the entire category.
			if (url[i] === "&" || i === 0) {
				let catStart = i + 1;
				let catStop = catStart;

				for (let j = catStart; j < url.length; ++j) {
					if (url[j] === "&") {
						catStop = j; // string.slice takes up to but NOT including as second parameter
						break;
					}
					if (j === url.length - 1) {
						catStop = url.length;
						break;
					}
				}

				const category = url.slice(catStart, catStop); // this is the entire category including key and values

				// once we have the entire category, split by the "=" to find the name and values
				const items = category.split("=");
				keyValues.set(items[0], items[1]);
			}
		}

		return keyValues;
	}

	/**
	 * Converts an array of strings into an array of integers.
	 *
	 * @param {string[]} str - The array of strings to be converted.
	 * @return {number[]} The array of integers resulting from the conversion.
	 */
	private atoi(str: string[]): number[] {
		const intVals: number[] = [];

		str.forEach((x: string) => {
			const num = parseInt(x);
			if (isNaN(num)) return;

			intVals.push(num);
		});

		return intVals;
	}

	/**
	 * Parses a URL string in the form `?weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a build map containing categories as keys and the indices of build items as values.
	 *
	 * @param {string} url - The URL string to parse.
	 * @return {Map<ItemCategory, number[]>} The build map parsed from the URL.
	 */
	private parseBuildMapFromUrl(url: string): Map<ItemCategory, number[]> {
		// Reset the items in the build generator before parsing the URL.
		this.resetItems();

		// Create a new build map to store the parsed categories and indices.
		const buildMap = new Map<ItemCategory, number[]>();

		// Get the key-value pairs from the URL.
		const keyValues = this.getKeyValuesFromUrl(url);

		// Iterate over the key-value pairs and parse the values into indices.
		for (const [key, value] of keyValues) {
			// Skip the iteration if the key is not a valid item category.
			if (!Object.values(ItemCategory).includes(key as ItemCategory)) continue;

			// Split the value by commas and convert them into integers.
			const values = value.split(",");
			if (values[0] === "") {
				// If the first value is an empty string, set the build map value to an empty array.
				buildMap.set(key as ItemCategory, []);
				continue;
			}

			const intVals = this.atoi(values);

			// Set the build map value to the parsed indices.
			buildMap.set(key as ItemCategory, intVals);
		}

		// Return the parsed build map.
		return buildMap;
	}
}
