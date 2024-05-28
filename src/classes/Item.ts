import { ItemType, ArmorCategory } from "../types/enums";
import BuildNums from "../types/types";
import data from "../data/data.json";

type Category = {
	count: number;
	items: any[];
};

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
class Build {
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
class BuildGenerator {
	_itemData: ItemData = data;
	_previouslyRolled: Set<Item> = new Set<Item>();
	_includePreviouslyRolled: boolean = false;
	_buildNums: BuildNums = {
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

	public generateUrl(): string {
		return this._includePreviouslyRolled ? this.generateRandomUnique() : this.generateRandom();
	}

	private generateRandom(): string {
		const build: Build = new Build();

		for (const key in this._itemData) {
			const count = this._itemData[key]["count"];
			const items = this._itemData[key]["items"];

			const rand = Math.random() * count;
			const item = items[rand];
			build.addItem(key, item);
		}

		return "";
	}

	private generateRandomUnique(): string {
		return "";
	}
}

export default { Item, Armor, Build, BuildGenerator };
