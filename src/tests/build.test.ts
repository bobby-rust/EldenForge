import { describe, it, expect } from "vitest";
import { Armor, Build, Item } from "../classes/BuildGenerator";
import { ArmorCategory, ItemType } from "../types/enums";

describe("Build", () => {
	describe("add item", () => {
		it("should add an item to the correct field", () => {
			const build = new Build();
			const weapon = new Item();
			weapon.type = ItemType.Weapon;
			weapon.name = "Test Weapon";
			build.addItem("weapons", weapon);
			expect(build._weapons.length).toBe(1);
			expect(build._weapons[0].name).toBe("Test Weapon");

			const armor = new Armor();
			armor._category = ArmorCategory.Leg;
			build.addItem(ItemType.Armor, armor);
			expect(build.leg).not.toBeNull();
		});
	});
});
