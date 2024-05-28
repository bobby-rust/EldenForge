import { ItemType, ArmorCategory } from "../types/enums";
import BuildNums from "../types/types";
import data from "../data/data.json";
import { builtinModules } from "module";

/**
 * An item category has `count` items and a list of that category's items
 */
type Category = {
	count: number;
	items: any[];
};

/**
 * The structure of the JSON data
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

	public createBuildFromUrl(url: string): Build {
		const categories = url.split("&");
		console.log(categories);
		return new Build();
	}

	public addItem(type: string, item: Item | Armor) {
		switch (type) {
			case "weapons":
				this.addWeapon(item);
				break;
			case "tears":
				this.addTear(item);
				break;
			case "incantations":
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
 * The BuildGenerator needs to generate a valid build and return a base64 encoded
 * URL parameter string of the form
 * ?&weapons=<comma_separated_indices>&armor=<comma_separated_indices>...
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

			for (let i = 0; i < numItems; ++i) {
				const rand = Math.floor(Math.random() * count);
				rolled.set(category, [...(rolled.get(category) || []), rand]);
			}
		}

		return this.createUrlFromRolledItems(rolled);
	}

	/**
	 * Generates a build of unique items (i.e., not previously rolled in prior generations)
	 * @returns {string} base64 encoded url parameters representing a build. See class header for more information.
	 */
	private generateRandomUnique(): string {
		const rolled: Map<string, number[]> = new Map<string, number[]>();

		console.log("Generating random unique build.");
		for (const category of Object.keys(this._itemData)) {
			const count = this._itemData[category]["count"];
			const numItems = this._buildNums[category];

			// if _previouslyRolled's category key is undefined, initialize a new set
			const prevRolled = this._previouslyRolled.get(category) ?? new Set<number>();
			if (prevRolled.size >= count) {
				// there are no more valid items, break out of inner loop, go to next category
				break;
			}

			for (let i = 0; i < numItems; ++i) {
				let rand = Math.floor(Math.random() * count);
				while (prevRolled.has(rand)) {
					// Keep rolling until a valid item is found.
					rand = Math.floor(Math.random() * count);
				}

				/**
				 * This is needed because Map and Set's get method can return undefined,
				 * in which case a new Map or Set needs to be initialized in order for an item to be added
				 */
				(this._previouslyRolled.get(category) ?? new Set<number>()).add(rand); // add item to previously rolled
				rolled.set(category, [...(rolled.get(category) ?? []), rand]); // add item to current rolled items
			}
		}

		console.log(rolled);
		return this.createUrlFromRolledItems(rolled);
	}

	private generateBuildFromUrl(encoded: string): Build {
		const build = new Build();
		const url = this.decode(encoded);
		const buildMap = this.parseBuildMapFromUrl(url);

		return build;
	}

	/**
	 * Parses a string of the form `?&weapons=<comma_separated_indices>&armors=<comma_separated_indices>...`
	 * into a Map containing categories as keys and the indices of build items as values
	 */
	private parseBuildMapFromUrl(str: string): Map<string, number[]> {
		// TODO: this function is a mess, i'll have no idea what any of this code is next time I look at it... probably try to write something better.
		const buildMap = new Map<string, number[]>();

		for (let i = 0; i < str.length; ++i) {
			let catStart = 0;
			let catStop = 0;
			if (str[i] === "&") {
				catStart = i + 1;
				for (let j = i + 1; j < str.length; ++j) {
					if (str[j] === "&") {
						catStop = j; // string.slice takes up to but NOT including as second parameter
					}
				}
			}

			const category = str.slice(catStart, catStop); // this is the entire category including key and values
			let nameStart = catStart;
			let nameStop = nameStart;

			while (str[++nameStop] !== "="); // find = sign

			const catName = str.slice(nameStart, nameStop);

			// parse indices
			let indicesStart = nameStop + 1;
			const strIndices: string[] = category.slice(indicesStart, catStop).split(",");
			const indices: number[] = [];
			for (let j = 0; j < strIndices.length; ++j) {
				indices.push(parseInt(strIndices[j]));
			}

			buildMap.set(catName, indices);
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
	private createUrlFromRolledItems(rolled: Map<string, number[]>): string {
		let url = "?";
		for (const category of rolled.keys()) {
			url += `&${category}=`;

			// IDK why TypeScript finds this necessary, rolled CLEARLY has category as we are LOOPING OVER ITS KEYS
			const items = rolled.get(category) ?? [];
			console.log("Items: ", items);
			items.forEach((num, i) => {
				url += i === items.length - 1 ? num.toString() : num.toString() + ",";
			});
		}

		url = url.slice(0, url.length - 1); // remove last comma
		return this.encode(url);
	}
}
