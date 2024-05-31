import { Item, Armor } from "../classes/BuildGenerator";
import { expect, test } from "vitest";
import { ArmorCategory, ItemType } from "../types/enums";

test("Item.type", () => {
	const item = new Item();
	expect(item.type).toBeNull();

	item.type = ItemType.Weapon;
	expect(item.type).toBe(ItemType.Weapon);
});

test("Item.name", () => {
	const item = new Item();
	expect(item.name).toBe("");

	item.name = "Test Item";
	expect(item.name).toBe("Test Item");
});

test("Item.index", () => {
	const item = new Item();
	expect(item.index).toBe(-1);

	item.index = 1;
	expect(item.index).toBe(1);
});

test("Item.image", () => {
	const item = new Item();
	expect(item.image).toBe("");

	item.image = "test.png";
	expect(item.image).toBe("test.png");
});

test("Item.wikiUrl", () => {
	const item = new Item();
	item.name = "Test Item";
	expect(item.wikiUrl).toBe("https://eldenring.wiki.fextralife.com/Test+Item");
});

test("Armor.category", () => {
	const armor = new Armor();
	expect(armor.category).toBeNull();

	armor.category = ArmorCategory.Helm;
	expect(armor.category).toBe(ArmorCategory.Helm);
});
