import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory } from "../types/enums";

describe("BuildGenerator", () => {
	describe("generateUrl", () => {
		let buildGenerator: BuildGenerator;
		beforeEach(() => {
			buildGenerator = new BuildGenerator();
		});

		describe("generateRandom", () => {
			it("should generate a random build"),
				() => {
					buildGenerator._excludePreviouslyRolled.seals = false;
					let isNonUnique = false;
					buildGenerator._buildNums.seals = 1;
					const rolledSeals = new Set<number>();

					for (let i = 0; i < 1000; ++i) {
						/**
						 * Even with a computer rolling the dice at a rate of 1 million times per second,
						 * it would take approximately 8.52×10^28 years for one value to not appear in 1000 rolls.
						 * This time span is many orders of magnitude longer than the current age of the universe,
						 * making the occurrence of this test giving a false-positive failure practically impossible
						 * within any reasonable timeframe.
						 */
						const url = buildGenerator.generateUrl();
						const build = buildGenerator.generateBuildFromUrl(url);

						if (rolledSeals.has(build._items.get(ItemCategory.Seals)![0])) {
							isNonUnique = true;
							break;
						}

						rolledSeals.add(build._items.get(ItemCategory.Seals)![0]);
					}

					expect(isNonUnique).toBe(true);
				};

			it("should generate a unique build", () => {
				let isUnique = true;
				buildGenerator._buildNums.seals = 1;
				const rolledSeals = new Set<number>();

				for (let i = 0; i < 10; ++i) {
					const url = buildGenerator.generateUrl();
					const build = buildGenerator.generateBuildFromUrl(url);

					expect(build._items.get(ItemCategory.Seals)).toBeDefined();
					expect(build._items.get(ItemCategory.Seals)).not.toBeNull();

					if (rolledSeals.has(build._items.get(ItemCategory.Seals)![0])) {
						isUnique = false;
					}

					rolledSeals.add(build._items.get(ItemCategory.Seals)![0]);
				}

				expect(isUnique).toBe(true);
				expect(rolledSeals.size).toBe(10); // there are 9 seals, but -1 is returned for no available seals
			});

			it("should generate a set of armor", () => {
				const url = buildGenerator.generateUrl();
				const build = buildGenerator.generateBuildFromUrl(url);

				expect(build._items.get(ItemCategory.Helm)?.length).toBe(1);
				expect(build._items.get(ItemCategory.Chest)?.length).toBe(1);
				expect(build._items.get(ItemCategory.Gauntlets)?.length).toBe(1);
				expect(build._items.get(ItemCategory.Leg)?.length).toBe(1);
			});

			it("should generate a unique set of armor", () => {
				let isUnique = true;
				const rolledArmors = new Set<number>();

				for (let i = 0; i < 167; ++i) {
					const url = buildGenerator.generateUrl();
					const build = buildGenerator.generateBuildFromUrl(url);

					expect(build._items.get(ItemCategory.Helm)).toBeDefined();

					if (rolledArmors.has(build._items.get(ItemCategory.Helm)![0])) {
						isUnique = false;
					}

					rolledArmors.add(build._items.get(ItemCategory.Helm)![0]);
				}

				const url = buildGenerator.generateUrl();
				const build = buildGenerator.generateBuildFromUrl(url);

				// After 167 rolls, the only available armor is -1
				expect(build._items.get(ItemCategory.Helm)?.[0]).toBe(-1);
				// The first 167 rolls should contain valid armors
				expect(rolledArmors.has(-1)).toBe(false);

				expect(isUnique).toBe(true);
				expect(rolledArmors.size).toBe(167);
			});
		});

		it("should return a url of the correct form", () => {
			const b64Url = buildGenerator.generateUrl();
			expect(typeof b64Url).toBe("string");
			const url = atob(b64Url);
			const regexp = new RegExp("&(?:[a-zA-Z]+=[0-9]{1,3}(?:,[0-9]{1,3}){0,3}|[a-zA-Z]+=&)+");
			expect(regexp.test(url)).toBe(true);
		});
	});
});
