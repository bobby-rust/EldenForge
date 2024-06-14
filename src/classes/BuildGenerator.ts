import { AIBuildType, BuildGenerationConfig, ItemData, defaultBuildGenerationConfig } from "../types/types";
import data from "../data/new_data.json";
import { ItemCategory } from "../types/enums";
import { Build } from "./Build";
import { Item } from "./Item";
import AIGenerator from "./AIGenerator";

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
export default class BuildGenerator {
	_itemData: ItemData = data;
	_buildGenerationConfig: BuildGenerationConfig = structuredClone(defaultBuildGenerationConfig);
	_build: Build = new Build();
	_ai: AIGenerator | undefined;

	private _buildType = "";

	set buildType(buildType: string) {
		this._buildType = buildType;
	}

	/**
	 * Generates a URL representing a build.
	 * The build cont_ains unique items if _excludePreviouslyRolled is false.
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	public generateUrl(): string {
		return this.generateRandom();
	}

	public async generateAIUrl(): Promise<string | null> {
		if (typeof this._ai === "undefined") {
			this.initAIGenerator();
		}
		const build = await this._ai?.getAIBuild(this._buildType);

		if (!build) return null;

		return this.createAIUrlFromAIBuild(build);
	}

	private createAIUrlFromAIBuild(build: AIBuildType): string {
		const buildMap = new Map<ItemCategory, number[]>();
		build.items.forEach((value, key) => {
			value.forEach((item) => {
				if (item.index === -1) return;
				if (typeof item.index === "undefined") return;
				buildMap.set(key, [...(buildMap.get(key) ?? []), item.index]);
			});
		});

		let url = this.createUrlFromBuildMap(buildMap);

		for (const category of Object.keys(build)) {
			if (category === "items") continue;
			url += `&${category}=${build[category]}`;
		}

		return url;
	}

	private resetItems() {
		this._build._items = new Map<ItemCategory, number[]>();
	}

	public rerollItem(category: ItemCategory, oldItem: number): Map<ItemCategory, number[]> {
		const newItem = this.generateItem(category);
		if (typeof newItem === "undefined") return this._build._items;
		this._build.replaceItem(category, oldItem, newItem);

		return this._build._items;
	}

	/**
	 * Generates a Build object from a base64 encoded URL.
	 * @param encoded The base64 encoded url.
	 * @returns {Build} A build object cont_aining the items of `encoded`
	 */
	public generateBuildFromUrl(encoded: string): Map<ItemCategory, Item[]> {
		const url = encoded;
		const buildMap = this.parseBuildMapFromUrl(url);
		const build: Map<ItemCategory, Item[]> = this.parseBuildFromMap(buildMap);
		return build;
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

		// Return the generated index
		return randomIndex;
	}

	public getBuildNumsForCategory(category: ItemCategory) {
		return this._buildGenerationConfig[category].buildNums;
	}

	public setBuildNumsForCategory(category: ItemCategory, buildNums: number) {
		this._buildGenerationConfig[category].buildNums = buildNums;
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
	 * @param rolled A Map cont_aining categories as keys and the indices of build items as values
	 * @returns {string} A base64 encoded ASCII string of the form
	 *                   `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 */
	public createUrlFromBuildMap(rolled: Map<ItemCategory, number[]>): string {
		let url = "";
		for (const category of rolled.keys()) {
			url += `&${category}=`;

			// IDK why TypeScript finds this necessary, rolled CLEARLY has category as we are LOOPING OVER ITS KEYS (ts 5.5 save me)
			const items = rolled.get(category) ?? [];

			items.forEach((num, i) => {
				if (typeof num === "undefined") {
					return;
				}

				this.addItemToPreviouslyRolled(category, num);
				url += i === items.length - 1 ? num.toString() : num.toString() + ",";
			});
		}

		url = url.slice(0, url.length); // remove last comma
		return url;
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
	public parseBuildFromMap(map: Map<ItemCategory, number[]>): Map<ItemCategory, Item[]> {
		this.resetItems();
		for (const [key, val] of map) {
			val.forEach((val: number) => {
				if (isNaN(val)) {
					return;
				}
				this._build.addItem(key, val);
			});
		}

		return this._build.getItemsFromBuild();
	}

	public parseAIBuildFromUrl(url: string): AIBuildType {
		const buildMap = this.parseBuildFromMap(this.parseBuildMapFromUrl(url));

		const build: AIBuildType = {
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
			items: buildMap,
		};

		for (let i = 0; i < url.length; ++i) {
			// If we are at an ampersand, slice out the entire category.
			if (url[i] === "&") {
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
				const categoryName = items[0] as ItemCategory;

				if (Object.values(ItemCategory).includes(categoryName)) continue;

				build[items[0]] = items[1];
			}
		}

		return build;
	}

	/**
	 * Parses a string of the form `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a build map cont_aining categories as keys and the indices of build items as values
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

				if (!Object.values(ItemCategory).includes(categoryName)) continue;

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

	private initAIGenerator() {
		this._ai = new AIGenerator();
	}
}
