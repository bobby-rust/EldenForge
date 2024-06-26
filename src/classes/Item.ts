import { ItemCategory } from "../types/enums";

/**
 * This class represents an item that is generated.
 * It contains only the fields needed by the application.
 */
export class Item {
	private _category: ItemCategory;
	private _name: string = "";
	private _index: number | undefined;
	private _image: string = "";
	private _wikiUrl: string = "";
	private _weight: number | undefined = undefined;
	private _attack: any[] = [];
	private _scalesWith: any[] = [];
	private _requiredAttributes: any[] = [];
	private _weaponCategory?: string = undefined;
	private _spellCost?: number = undefined;
	private _effects?: string = undefined;
	private _affinity?: string = undefined;
	private _description?: string = undefined;
	private _dmgNegation?: any[] | undefined = undefined;
	private _resistance?: any[] | undefined = undefined;

	constructor(category: ItemCategory, rawItemData: any, index: number) {
		this._category = category;
		if (!rawItemData) {
			console.log("Got no data");
			return;
		}
		this.name = rawItemData["name"];
		this.index = index;
		this.image = rawItemData["image"];
		this.weight = rawItemData["weight"];
		this.attack = rawItemData["attack"];
		this.scalesWith = rawItemData["scalesWith"];
		this.requiredAttributes = rawItemData["requiredAttributes"];
		this.affinity = rawItemData["affinity"];

		if (category === ItemCategory.Weapons) {
			this.weaponCategory = rawItemData["category"];
		}

		if (category === ItemCategory.Sorcs || category === ItemCategory.Incants) {
			this.effects = rawItemData["effects"];
			this.spellCost = rawItemData["cost"];
		}

		if (category === ItemCategory.Talismans) {
			this.effects = rawItemData["effect"];
		}

		if (category === ItemCategory.Tears) {
			this.description = rawItemData["description"];
		}

		if (
			category === ItemCategory.Helm ||
			category === ItemCategory.Chest ||
			category === ItemCategory.Gauntlets ||
			category === ItemCategory.Leg
		) {
			this.dmgNegation = rawItemData["dmgNegation"];
			this.resistance = rawItemData["resistance"];
		}
	}

	/**
	 * The type of the item (e.g., weapon, spirit, talisman, etc.).
	 */
	get category(): ItemCategory {
		return this._category;
	}

	set category(category: ItemCategory) {
		this._category = category;
	}

	get name(): string {
		return this._name;
	}

	/**
	 * The name setter automatically sets the wiki url.
	 */
	set name(name: string) {
		this._name = name;
		if (name.includes("+")) {
			let wikiName: string | string[] = this._name.split(" ");
			wikiName.pop();
			wikiName = wikiName.join("+");
			this._wikiUrl = "https://eldenring.wiki.fextralife.com/" + wikiName;
		} else {
			this._wikiUrl = "https://eldenring.wiki.fextralife.com/" + this._name.split(" ").join("+"); // or replaceAll(" ", "+") ? not sure which is more efficient
		}
	}

	/**
	 * The index of the item in the raw data array.
	 */
	get index(): number | undefined {
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

	get weight(): number | undefined {
		return this._weight;
	}

	set weight(weight: number) {
		this._weight = weight;
	}

	get attack(): any[] {
		return this._attack;
	}

	set attack(attack: any[]) {
		this._attack = attack;
	}

	get scalesWith(): any[] {
		return this._scalesWith;
	}

	set scalesWith(scalesWith: any[]) {
		this._scalesWith = scalesWith;
	}

	get requiredAttributes(): any[] {
		return this._requiredAttributes;
	}

	set requiredAttributes(requiredAttributes: any[]) {
		this._requiredAttributes = requiredAttributes;
	}

	get weaponCategory(): string | undefined {
		return this._weaponCategory;
	}

	set weaponCategory(weaponCategory: string | undefined) {
		this._weaponCategory = weaponCategory;
	}

	get spellCost(): number | undefined {
		return this._spellCost;
	}

	set spellCost(spellCost: number | undefined) {
		this._spellCost = spellCost;
	}

	get effects(): string | undefined {
		return this._effects;
	}

	set effects(effects: string | undefined) {
		this._effects = effects;
	}

	get affinity(): string | undefined {
		return this._affinity;
	}

	set affinity(affinity: string | undefined) {
		this._affinity = affinity;
	}

	set description(description: string | undefined) {
		this._description = description;
	}

	get description(): string | undefined {
		return this._description;
	}

	get dmgNegation(): {}[] | undefined {
		return this._dmgNegation;
	}

	set dmgNegation(dmgNegation: {}[] | undefined) {
		this._dmgNegation = dmgNegation;
	}

	get resistance(): {}[] | undefined {
		return this._resistance;
	}

	set resistance(resistance: {}[] | undefined) {
		this._resistance = resistance;
	}
}
