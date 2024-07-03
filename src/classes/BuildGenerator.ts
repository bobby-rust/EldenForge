import { AIBuildType, BuildGenerationConfig, ItemData, defaultBuildGenerationConfig } from "../types/types";
import data from "../data/new_new_data.json";
import { ItemCategory } from "../types/enums";
import { Build } from "./Build";
import { Item } from "./Item";
import AIGenerator from "./AIGenerator";
import {
	NUM_SOTE_ASHES,
	NUM_SOTE_CHESTS,
	NUM_SOTE_GAUNTLETS,
	NUM_SOTE_HELMS,
	NUM_SOTE_INCANTS,
	NUM_SOTE_LEGS,
	NUM_SOTE_SEALS,
	NUM_SOTE_SHIELDS,
	NUM_SOTE_SORCS,
	NUM_SOTE_SPIRITS,
	NUM_SOTE_TALISMANS,
	NUM_SOTE_WEAPONS,
} from "@/types/constants";

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
	 * The build contains unique items if _excludePreviouslyRolled is false.
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

	public setNumItems(category: ItemCategory, numItems: number): void {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums = numItems;
	}

	public generateItemsForCategory(category: ItemCategory) {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.previouslyRolled.clear();
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums =
			defaultBuildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums;

		// This function should only be called when the build has no items for the category
		if (this._build._items.get(category)?.length !== 0) {
			return this._build._items;
		}

		for (let i = 0; i < defaultBuildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums; i++) {
			const item = this.generateItem(category);
			typeof item !== "undefined" && this._build.addItem(category, item);
		}

		return this._build._items;
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
	public generateBuildFromUrl(encoded: string): Map<ItemCategory, Item[]> {
		if (encoded === "") return new Map<ItemCategory, Item[]>();
		const url = encoded;
		const buildMap = this.parseBuildMapFromUrl(url);
		const build: Map<ItemCategory, Item[]> = this.parseBuildFromMap(buildMap);
		return build;
	}

	public setIncludeDlc(includeDlc: boolean) {
		this._buildGenerationConfig.includeDlc = includeDlc;
	}

	private calculateCount(category: ItemCategory): number {
		if (this._buildGenerationConfig.includeDlc) {
			return this._itemData[category]["count"];
		}

		let difference;
		switch (category) {
			case ItemCategory.Helm:
				difference = NUM_SOTE_HELMS;
				break;
			case ItemCategory.Chest:
				difference = NUM_SOTE_CHESTS;
				break;
			case ItemCategory.Gauntlets:
				difference = NUM_SOTE_GAUNTLETS;
				break;
			case ItemCategory.Leg:
				difference = NUM_SOTE_LEGS;
				break;
			case ItemCategory.Ashes:
				difference = NUM_SOTE_ASHES;
				break;
			case ItemCategory.Incants:
				difference = NUM_SOTE_INCANTS;
				break;
			case ItemCategory.Shields:
				difference = NUM_SOTE_SHIELDS;
				break;
			case ItemCategory.Talismans:
				difference = NUM_SOTE_TALISMANS;
				break;
			case ItemCategory.Seals:
				difference = NUM_SOTE_SEALS;
				break;
			case ItemCategory.Sorcs:
				difference = NUM_SOTE_SORCS;
				break;
			case ItemCategory.Spirits:
				difference = NUM_SOTE_SPIRITS;
				break;
			case ItemCategory.Weapons:
				difference = NUM_SOTE_WEAPONS;
				break;
			default:
				return this._itemData[category]["count"];
		}

		return this._itemData[category]["count"] - difference;
	}

	/**
	 * Generates a random index of an item from a given category.
	 * If `_excludePreviouslyRolled` is true, it generates an index of an unrolled item.
	 *
	 * @param {ItemCategory} category - The category of the item to generate.
	 * @returns {number | undefined} - The index of the generated item or undefined if all items in the category have been rolled.
	 */
	public generateItem(category: ItemCategory): number | undefined {
		// Get the count of items in the category
		const count = this.calculateCount(category);
		// Generate a random index between 0 and count - 1
		let randomIndex = Math.floor(Math.random() * count);

		// Get the set of previously rolled items for the category
		const prevRolledItems = this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.previouslyRolled;

		// If all items in the category have been rolled, return -1
		if (prevRolledItems.size >= count) {
			return;
		}

		// If `_excludePreviouslyRolled` is true and the generated index is of a previously rolled item,
		// generate a new index until an unrolled item is found.
		while (
			(this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled &&
				prevRolledItems.has(randomIndex)) ||
			this._build._items.get(category)?.includes(randomIndex)
		) {
			console.log("x");
			randomIndex = Math.floor(Math.random() * count);
		}

		// Add the generated index to the set of previously rolled items if `excludePreviouslyRolled` is true
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled &&
			this.addItemToPreviouslyRolled(category, randomIndex);

		// Return the generated index
		return randomIndex;
	}

	public getBuildNumsForCategory(category: ItemCategory) {
		return this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.buildNums;
	}

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
	 *
	 * @param {ItemCategory} category - The category for which to set the value.
	 * @param {boolean} exclude - The new value for `excludePreviouslyRolled`.
	 */
	public setExcludePreviouslyRolledForCategory(category: ItemCategory, exclude: boolean) {
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.excludePreviouslyRolled = exclude;
		!exclude ? this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.previouslyRolled.clear() : null;
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

				// this.addItemToPreviouslyRolled(category, num);
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
		this.resetItems();

		/**
		 * Maps the category to the indices of the items rolled for that category for the current build
		 */
		const buildMap: Map<ItemCategory, number[]> = new Map<ItemCategory, number[]>();

		for (const category of Object.keys(this._itemData)) {
			const numItemsToRoll = this.getBuildNumsForCategory(category as ItemCategory);
			buildMap.set(category as ItemCategory, []);
			for (let i = 0; i < numItemsToRoll; ++i) {
				const itemIndex = this.generateItem(category as ItemCategory);
				if (typeof itemIndex === "undefined") {
					continue;
				}
				this.addItemToBuildMap(category as ItemCategory, itemIndex, buildMap);
				this._build.addItem(category as ItemCategory, itemIndex);
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
		this._buildGenerationConfig.buildInfo.categoryConfigs.get(category)!.previouslyRolled.add(item);
	}

	public addItemsToPreviouslyRolled(items: Map<ItemCategory, number[]>) {
		items.forEach((items, category) => {
			items.forEach((item) => {
				this.addItemToPreviouslyRolled(category, item);
			});
		});
	}

	/**
	 * Parses a Build from a build map where the keys are the category
	 * and the values are the list of indices of items for that category.
	 * @param map the build map to parse.
	 * @returns {Build} the Build object.
	 */
	public parseBuildFromMap(map: Map<ItemCategory, number[]>): Map<ItemCategory, Item[]> {
		for (const [key, val] of map) {
			if (val.length === 0) {
				this._build._items.set(key, []);
			}
			val.forEach((val: number) => {
				if (isNaN(val)) {
					console.log("Invalid item index: ", val);
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
	 * Parses a string of the form `?weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a build map cont_aining categories as keys and the indices of build items as values
	 */
	private parseBuildMapFromUrl(str: string): Map<ItemCategory, number[]> {
		this.resetItems();

		const buildMap = new Map<ItemCategory, number[]>();

		for (let i = 0; i < str.length; ++i) {
			// If we are at an ampersand, slice out the entire category.
			if (str[i] === "&" || i === 0) {
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
