import { describe, it, expect, beforeEach } from "vitest";
import { Build } from "../classes/Build";
import { ItemCategory } from "../types/enums";
import { Item } from "../classes/Item";

describe("Build", () => {
	let build: Build;
	beforeEach(() => {
		build = new Build();
	});

	describe("add item", () => {
		it("should add an item to the correct field", () => {
			build.addItem(ItemCategory.Weapons, 0);
			expect((build._items.get(ItemCategory.Weapons) ?? [])[0]).toBe(0);
		});
	});

	describe("replaceItem", () => {
		it("should replace the item with the new one", () => {
			build.addItem(ItemCategory.Weapons, 0);
			build.replaceItem(ItemCategory.Weapons, 0, 1);
			expect((build._items.get(ItemCategory.Weapons) ?? [])[0]).toBe(1);
		});

		it("should throw an error if the item list is empty", () => {
			expect(() => build.replaceItem(ItemCategory.Weapons, 0, 1)).toThrow();
		});
	});

	describe("getItemsFromBuild", () => {
		it("should get the items from the build", () => {
			build.addItem(ItemCategory.Weapons, 0);
			build.addItem(ItemCategory.Weapons, 1);
			build.addItem(ItemCategory.Weapons, 2);
			build.addItem(ItemCategory.Weapons, 3);

			const items: Map<ItemCategory, Item[]> = build.getItemsFromBuild();
			expect(items.get(ItemCategory.Weapons)?.length).toBe(4);
			expect(items.get(ItemCategory.Weapons)?.[0].index).toBe(0);
			expect(items.get(ItemCategory.Weapons)?.[0].name).toBe("Hand Axe");
		});
	});
});
