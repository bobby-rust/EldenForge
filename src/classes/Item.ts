import { ItemCategory } from "../types/enums";

/**
 * This class represents an item that is generated.
 * It contains only the fields needed by the application.
 * The application displays the item's name, an image of the item,
 * and each item contains a link the item's wiki page
 * The item type is used to categorize the items.
 */
export class Item {
	private _category: ItemCategory;
	private _name: string = "";
	private _index: number | undefined;
	private _image: string = "";
	private _wikiUrl: string = "";

	constructor(category: ItemCategory, rawItemData: any, index: number) {
		this._category = category;
		this.name = rawItemData["name"];
		this.index = index;
		this.image = rawItemData["image"];
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
		this._wikiUrl = "https://eldenring.wiki.fextralife.com/" + this._name.split(" ").join("+"); // or replaceAll(" ", "+") ? not sure which is more efficient
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
}
