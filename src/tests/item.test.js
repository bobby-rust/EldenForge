import { Item } from "../classes/Item";
import { expect, it, describe } from "vitest";
import { ItemCategory } from "../types/enums";
import data from "../data/new_data.json";

describe("Item", () => {
	it("should initialize properly", () => {
		const item = new Item(ItemCategory.Weapons, data["weapons"].items[0], 0);
		expect(item.category).toBe(ItemCategory.Weapons);
		expect(item.name).toBe("Hand Axe");
		expect(item.image).toBe("https://eldenring.fanapis.com/images/weapons/17f69c35d2cl0i1oh7zuqfb3mdvsj.png");
		expect(item.index).toBe(0);
		expect(item.wikiUrl).toBe("https://eldenring.wiki.fextralife.com/Hand+Axe");
	});
});
