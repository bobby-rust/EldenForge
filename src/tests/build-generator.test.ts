import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory } from "../types/enums";

describe("BuildGenerator", () => {
	let buildGenerator: BuildGenerator;
	beforeEach(() => {
		buildGenerator = new BuildGenerator();
	});
	describe("generateUrl", () => {
		it("should return a url of the correct form", () => {
			const b64Url = buildGenerator.generateUrl();
			expect(typeof b64Url).toBe("string");
			const url = atob(b64Url);
			const regexp = new RegExp("&(?:[a-zA-Z]+=[0-9]{1,3}(?:,[0-9]{1,3}){0,3}|[a-zA-Z]+=&)+");
			expect(regexp.test(url)).toBe(true);
		});
	});

	describe("generateRandom", () => {
		it("should generate a random build"),
			() => {
				buildGenerator._buildGenerationConfig.seals.excludePreviosuslyRolled = false;
				let isNonUnique = false;
				const rolledItems = new Map<ItemCategory, Set<number>>();

				for (let i = 0; i < 10000; ++i) {
					const url = buildGenerator.generateUrl();
					const build = buildGenerator.generateBuildFromUrl(url);

					if (rolledItems.get(ItemCategory.Seals)?.has(build._items.get(ItemCategory.Seals)![0])) {
						isNonUnique = true;
						break;
					}

					rolledItems.get(ItemCategory.Seals)?.add(build._items.get(ItemCategory.Seals)![0]);
				}

				expect(isNonUnique).toBe(true);
			};

		it("should generate a unique build", () => {
			let isUnique = true;
			buildGenerator._buildGenerationConfig.seals.buildNums = 1;
			const rolledSeals = new Set<number>();

			for (let i = 0; i < 9; ++i) {
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
			expect(rolledSeals.size).toBe(9);
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
			const buildGenerator = new BuildGenerator();

			for (let i = 0; i < 167; ++i) {
				const prevRolled = structuredClone(buildGenerator._buildGenerationConfig.helms.previouslyRolled);

				const url = buildGenerator.generateUrl();
				const build = buildGenerator.generateBuildFromUrl(url);

				expect(build._items.get(ItemCategory.Helm)).toBeDefined();

				if (prevRolled.has(build._items.get(ItemCategory.Helm)![0])) {
					isUnique = false;
				}
			}

			const url = buildGenerator.generateUrl();
			const build = buildGenerator.generateBuildFromUrl(url);

			// After 167 rolls, the only available armor is -1
			expect(build._items.get(ItemCategory.Helm)?.[0]).toBe(-1);

			// The first 167 rolls should contain valid armors
			expect(buildGenerator._buildGenerationConfig.helms.previouslyRolled.has(-1)).toBe(false);

			expect(isUnique).toBe(true);
			expect(buildGenerator._buildGenerationConfig.helms.previouslyRolled.size).toBe(167);
		});
	});
});
