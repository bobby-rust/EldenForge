import { ItemType, ArmorCategory } from "../types/enums";
import { BuildNums } from "../types/types";
import data from "../data/data.json";
import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";

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
	armors: Category;
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

/**
 * This class represents an item that is generated.
 * It contains only the fields needed by the application.
 * The application displays the item's name, an image of the item,
 * and each item contains a link the item's wiki page
 * The item type is used to categorize the items.
 */
class Item {
	private _type: ItemType | null = null;
	private _name: string = "";
	private _index: number = -1;
	private _image: string = "";
	private _wikiUrl: string = "";

	/**
	 * The type of the item (e.g., weapon, spirit, talisman, etc.).
	 */
	get type(): ItemType | null {
		return this._type;
	}

	set type(type: ItemType) {
		this._type = type;
	}

	get name(): string {
		return this._name;
	}

	/**
	 * The name setter automatically sets the wiki url.
	 */
	set name(name: string) {
		this._name = name;
		this._wikiUrl = "https://eldenring.wiki.fextralife.com/" + this._name.split(" ").join("+"); // or replaceAll(" ", "+") ? not sure which is more efficient
	}

	/**
	 * The index of the item in the raw data array.
	 */
	get index(): number {
		return this._index;
	}

	set index(index: number) {
		this._index = index;
	}

	get image(): string {
		return this._image;
	}

	set image(image: string) {
		this._image = image;
	}

	get wikiUrl(): string {
		return this._wikiUrl;
	}
}

/**
 * Armor is a unique item type because it contains an additional field
 * `category` needed for generation.
 */
class Armor extends Item {
	/**
	 * The armor category (helm, chest, gauntlets, leg)
	 */
	_category: ArmorCategory | null = null;
	constructor() {
		super();
	}

	get category(): ArmorCategory | null {
		return this._category;
	}

	set category(category: ArmorCategory) {
		this._category = category;
	}
}

/**
 * Represents a generated build.
 */
export class Build {
	_class: Item | null = null;
	_weapons: Item[] = [];
	_helm: Armor | null = null;
	_chest: Armor | null = null;
	_gauntlets: Armor | null = null;
	_leg: Armor | null = null;
	_tears: Item[] = [];
	_incants: Item[] = [];
	_seals: Item[] = [];
	_shields: Item[] = [];
	_sorcs: Item[] = [];
	_spirits: Item[] = [];
	_talismans: Item[] = [];
	_urlParams: string = "";

	constructor() {
		console.log("Initialized a new build.");
	}

	/**
	 * Adds an item to `this` object.
	 * @param type the type of item.
	 * @param item the item to add.
	 */
	public addItem(type: string, item: Item | Armor) {
		switch (type) {
			case "classes":
				this.addClass(item);
				break;
			case "weapons":
				this.addWeapon(item);
				break;
			case "tears":
				this.addTear(item);
				break;
			case "incants":
				this.addIncant(item);
				break;
			case "seals":
				this.addSeal(item);
				break;
			case "shields":
				this.addShield(item);
				break;
			case "sorcs":
				this.addSorc(item);
				break;
			case "spirits":
				this.addSpirit(item);
				break;
			case "talismans":
				this.addTalisman(item);
				break;

			case "armors":
				const armor: Armor = item as Armor;
				switch (armor.category) {
					case ArmorCategory.Helm:
						this._helm = armor;
						break;
					case ArmorCategory.Chest:
						this._chest = armor;
						break;
					case ArmorCategory.Gauntlets:
						this._gauntlets = armor;
						break;
					case ArmorCategory.Leg:
						this._leg = armor;
						break;
				}
		}
	}

	private addClass(c: Item) {
		this._class = c;
	}

	private addWeapon(weapon: Item) {
		this._weapons.push(weapon);
	}

	private addTear(tear: Item) {
		this._tears.push(tear);
	}

	private addIncant(incant: Item) {
		this._incants.push(incant);
	}

	private addSeal(seal: Item) {
		this._seals.push(seal);
	}

	private addShield(shield: Item) {
		this._shields.push(shield);
	}

	private addSorc(sorc: Item) {
		this._sorcs.push(sorc);
	}

	private addSpirit(spirit: Item) {
		this._spirits.push(spirit);
	}

	private addTalisman(talisman: Item) {
		this._talismans.push(talisman);
	}

	set helm(helm: Armor) {
		this._helm = helm;
	}

	set chest(chest: Armor) {
		this._chest = chest;
	}

	set gaunlets(gauntlets: Armor) {
		this._gauntlets = gauntlets;
	}

	set leg(leg: Armor) {
		this._leg = leg;
	}
}

/**
 * NOTE: Consider breaking this class up into two children classes, AIGenerator and RandomGenerator instead of one monolithic class
 *
 * The BuildGenerator needs to generate a valid build and return a base64 encoded
 * URL parameter string of the form
 * ?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...
 *
 * This object will also keep track of the state of generated items
 * and a boolean flag `_includePreviouslyRolled`
 * which are used to determine if generated items are valid.
 * If a generated item is not valid (i.e. _includePreviouslyRolled is false and the item has already been generated),
 * it will keep regenerating items until a valid item is found or there are no more valid items.
 */
export default class BuildGenerator {
	_itemData: ItemData = data;
	/**
	 * Maps the category to the indices of the rolled items in that category for all builds.
	 * The value is a Set for more efficient access of numbers
	 */
	_previouslyRolled: Map<string, Set<number>> = new Map<string, Set<number>>();
	_includePreviouslyRolled: boolean = false;
	_buildNums: BuildNums = {
		armors: 4,
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
	 * The build contains unique items if _includePreviouslyRolled is false.
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	public generateUrl(): string {
		return this._includePreviouslyRolled ? this.generateRandom() : this.generateRandomUnique();
	}

	/**
	 * Generates a random build of items
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	private generateRandom(): string {
		/**
		 * Maps the category to the indices of the items rolled for that category for the current build
		 * This values is an array because we do not need to access numbers at arbitrary indices.
		 */
		const rolled: Map<string, number[]> = new Map<string, number[]>();

		console.log("Generating random build.");
		for (const category of Object.keys(this._itemData)) {
			const count = this._itemData[category]["count"];
			const numItems = this._buildNums[category];

			if (category === "armors") {
				const armors = this.generateArmors();
				armors.forEach((armor) => {
					this.addItemToBuildMap(category, armor, rolled);
				});
				continue;
			}

			for (let i = 0; i < numItems; ++i) {
				const rand = Math.floor(Math.random() * count);
				rolled.set(category, [...(rolled.get(category) || []), rand]);
			}
		}

		return this.createUrlFromBuildMap(rolled);
	}

	/**
	 * Generates a build of unique items (i.e., not previously rolled in prior generations)
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	private generateRandomUnique(): string {
		const buildMap: Map<string, number[]> = new Map<string, number[]>();

		console.log("Generating random unique build.");
		for (const category of Object.keys(this._itemData)) {
			const count = this._itemData[category]["count"];
			const numItems = this._buildNums[category];

			if (category === "armors") {
				const armors = this.generateArmors();
				armors.forEach((armor: number) => {
					this.addItemToBuildMap(category, armor, buildMap);
				});
				continue;
			}

			// if _previouslyRolled's category key is undefined, initialize a new set
			const prevRolled = this._previouslyRolled.get(category) ?? new Set<number>();
			if (prevRolled.size >= count) {
				// there are no more valid items, break out of inner loop, go to next category
				if (!buildMap.has(category)) {
					// ensure that the set contains an entry for each category, even if empty
					buildMap.set(category, []);
				}
				break;
			}

			for (let i = 0; i < numItems; ++i) {
				let rand = Math.floor(Math.random() * count);
				while (prevRolled.has(rand)) {
					// Keep rolling until a valid item is found.
					rand = Math.floor(Math.random() * count);
				}

				this.addItemToBuildMap(category, rand, buildMap);
			}
		}

		console.log("Generated build map: ", buildMap);

		return this.createUrlFromBuildMap(buildMap);
	}

	private addItemToBuildMap(category: string, item: number, map: Map<string, number[]>) {
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
	private addItemToPreviouslyRolled(category: string, item: number) {
		const newItems = (this._previouslyRolled.get(category) ?? new Set<number>()).add(item); // add item to previously rolled
		this._previouslyRolled.set(category, newItems);
	}

	/**
	 * Generates a random set of armor.
	 * @returns {number[]} the list of armor indices
	 */
	private generateArmors(): number[] {
		return this._includePreviouslyRolled ? this.generateRandomArmors() : this.generateRandomUniqueArmors();
	}

	private generateRandomArmors(): number[] {
		const armors: number[] = [];
		const armorsData = data["armors"];
		const count = armorsData["count"];
		const items = armorsData["items"];
		const armorsMap = new Map<string, number>();

		while (armors.length < 4) {
			const rand = Math.floor(Math.random() * count);

			const item = items[rand];
			if (armorsMap.has(item["category"])) {
				continue;
			}

			armorsMap.set(item.category, rand);
			armors.push(rand);
		}

		return armors;
	}

	private generateRandomUniqueArmors(): number[] {
		const armors: number[] = [];
		const armorsData = data["armors"];
		const count = armorsData["count"];
		const items = armorsData["items"];
		const armorsMap = new Map<string, number>();

		while (armors.length < 4 && (this._previouslyRolled.get("armors") ?? new Set<number>()).size < count) {
			const rand = Math.floor(Math.random() * count);
			const item = items[rand];

			if (armorsMap.has(item["category"]) || (this._previouslyRolled.get("armors") ?? new Set<number>()).has(rand)) {
				continue;
			}

			armorsMap.set(item.category, rand);
			armors.push(rand);
			this.addItemToPreviouslyRolled("armors", rand);
		}
		return armors;
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
	 * Parses a Build from a build map where the keys are the category
	 * and the values are the list of indices of items for that category.
	 * @param map the build map to parse.
	 * @returns {Build} the Build object.
	 */
	private parseBuildFromMap(map: Map<string, number[]>): Build {
		const build = new Build();

		console.log("Parsing map: ", map);
		for (const [key, val] of map) {
			console.log("Key, val: ");
			console.log(key, val);
			// TODO: fix bug
			val.forEach((val: number) => {
				if (isNaN(val)) {
					console.log("WHY ME");
				}
				const item = this.getItem(key, val);
				build.addItem(key, item);
			});
		}

		return build;
	}

	/**
	 * Gets a piece of armor.
	 * @param index the index of the armor piece in armors data
	 * @returns {Armor} the armor piece.
	 */
	private getArmor(index: number): Armor {
		const armor = new Armor();
		const itemData: any = data["armors"].items[index]; // Apparently Armors is a complex type that I cba to play around with atm.

		armor.image = itemData["image"];
		armor.index = index;
		armor.name = itemData["name"];
		armor.type = ItemType.Armor;
		armor.category = itemData["category"];

		return armor;
	}

	/**
	 * Gets an item object from its type and index.
	 * @param type the type of item
	 * @param index the index of the item in the raw data
	 * @returns {Item | Armor} the item.
	 */
	private getItem(type: string, index: number): Item | Armor {
		if (type === "armors") {
			return this.getArmor(index);
		}

		const item = new Item();
		const itemData = data[type as keyof typeof data].items[index]; // Just pleasing TypeScript...
		item.image = itemData["image"];
		item.index = index;
		item.name = itemData["name"];
		item.type = type as ItemType;

		return item;
	}

	/**
	 * Parses a string of the form `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a build map containing categories as keys and the indices of build items as values
	 */
	private parseBuildMapFromUrl(str: string): Map<string, number[]> {
		const buildMap = new Map<string, number[]>();

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
				const name = items[0];
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
				buildMap.set(name, intVals);
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
	private createUrlFromBuildMap(rolled: Map<string, number[]>): string {
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

	public generateAIBuild(): Build {
		const build = new Build();
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
}

export class AIWrapper {
	private _API_KEY: string = import.meta.env.VITE_API_KEY;
	private _genAI = new GoogleGenerativeAI(this._API_KEY);

	private _generationConfig: GenerationConfig = {
		temperature: 1.0, // Maximum randomness
		topP: 1.0, // The cumulative probability of potential tokens in which to stop considering subsequent tokens, 1.0 is max
		topK: 50, // Consider the top K tokens
	};

	private _model: any = this._genAI.getGenerativeModel({ ...this._generationConfig, model: "gemini-1.5-pro" });
	private _prompt = import.meta.env.VITE_PROMPT;

	private _generator = new BuildGenerator();

	constructor() {
		console.log("New AIWrapper initialized.");
	}

	/**
	 * Prompts the LLM and returns the response
	 * @returns {Promise<string>} the AI response
	 */
	async queryAI(): Promise<string> {
		const result = await this._model.generateContent(this._prompt);
		const response = await result.response;
		const text = response.text();
		console.log(text);
		return text;
	}

	/**
	 * Parses the AI response into a build URL
	 * @returns {string} the build url
	 */
	parseResponse(): string {
		const url = "";
		const response = `Name=Oathbound Duelist
        Vigor=40
        Mind=16
        Endurance=25
        Strength=18
        Dexterity=40
        Intelligence=9
        Faith=12
        Arcane=7
        Class=Samurai
        Weapons='Uchigatana' | 'Regalia of Eochaid'
        Helm='None'
        Chest Armor='Ronin's Armor'
        Gauntlets='None'
        Leg Armor='Ronin's Greaves'
        Crystal Tears='Cerulean Hidden Tear'
        Incantations='Golden Vow' | 'Flame, Grant Me Strength'
        Sacred Seals='None'
        Shields='None'
        Sorceries='None'
        Spirit Ashes='Black Knife Tiche'
        Talismans='Rotten Winged Sword Insignia' | 'Lord of Blood's Exultation' | 'Green Turtle Talisman' | 'Carian Filigreed Crest'
        Summary=This build is a glass cannon bleed/Dex build that utilizes the unique combination of 'Uchigatana' and 'Regalia of Eochaid' to inflict bleed quickly with high damage output.  It uses minimal armor to maintain light equip load and prioritize dodging and mobility. The 'Black Knife Tiche' ashes supplement the player's damage and stagger enemies.
        Strengths=Very high damage output | Extremely mobile | Good stagger potential | Can inflict bleed quickly
        Weaknesses=Very low defense | Requires precise dodging and spacing | Susceptible to crowd control | Low FP`;

		// needs to parse the response into a build map -> Map<string, number[]>

		const responseArray = response.split("\n");
		const mapArray: string[][] = [];
		responseArray.forEach((el: string) => {
			const currKeyValPair = el.trim().split("=");
			mapArray.push(currKeyValPair);
		});

		const buildMap = this.createBuildMap(mapArray);
		console.log(buildMap);
		return url;
	}

	/**
	 * Creates a build map from an array of arrays of key, value pairs.
	 * @param arr An array containing arrays of key, value pairs where they key is the category and the value is the name of the item.
	 * @returns {Map<string, number[]>} a map representing a build.
	 */
	private createBuildMap(arr: string[][]): Map<string, number[]> {
		const buildMap = new Map<string, number[]>();

		arr.forEach((kvPair: string[]) => {
			const key = this.parseCategoryFromResponse(kvPair[0]);

			if (key === "") return;

			const value = kvPair[1];

			const names = value.split("|");
			console.log(names);
			names.forEach((name) => {
				const item = this._generator.getItemFromName(key, name);
				buildMap.set(key, [...(buildMap.get(key) ?? []), item]);
			});
		});

		return buildMap;
	}

	private parseCategoryFromResponse(cat: string): string {
		switch (cat) {
			case "Class":
				return "classes";
			case "Weapons":
				return "weapons";
			case "Helm" || "Chest Armor" || "Leg Armor" || "Gauntlets":
				return "armors";
			case "Crystal Tears":
				return "tears";
			case "Shields" || "Sorceries" || "Talismans":
				return cat.toLowerCase();
			case "Incantations":
				return "incants";
			case "Sacred Seals":
				return "seals";
			case "Spirit Ashes":
				return "spirits";

			// TODO: handle ashes of war?
			default:
				console.log("Invalid category.");
				return "";
		}
	}
}
