import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory } from "../types/enums";

describe("BuildGenerator", () => {
	let buildGenerator: BuildGenerator;

	beforeEach(() => {
		// @ts-expect-error
		BuildGenerator.instance = undefined;
		buildGenerator = new BuildGenerator();
	});

	describe("generateUrl", () => {
		it("should return a url of the correct form", () => {
			const b64Url = buildGenerator.generateUrl();
			expect(typeof b64Url).toBe("string");
			// const url = atob(b64Url);
			const url = b64Url;
			const regexp = new RegExp("&(?:[a-zA-Z]+=[0-9]{1,3}(?:,[0-9]{1,3}){0,3}|[a-zA-Z]+=&)+");
			expect(regexp.test(url)).toBe(true);
		});
	});

	describe("generateRandom", () => {
		it("should generate a random build"),
			() => {
				buildGenerator._buildGenerationConfig.seals.excludePreviouslyRolled = false;
				let isNonUnique = false;
				const rolledItems = new Map<ItemCategory, Set<number>>();

				for (let i = 0; i < 10000; ++i) {
					const url = buildGenerator.generateUrl();
					const build = buildGenerator.generateBuildFromUrl(url);

					if (rolledItems.get(ItemCategory.Seals)?.has(build.get(ItemCategory.Seals)?.[0].index!)) {
						isNonUnique = true;
						break;
					}

					rolledItems.get(ItemCategory.Seals)?.add(build.get(ItemCategory.Seals)?.[0].index!);
				}

				expect(isNonUnique).toBe(true);
			};

		it("should generate a unique build", () => {
			buildGenerator = new BuildGenerator();
			let isUnique = true;
			buildGenerator._buildGenerationConfig.seals.buildNums = 1;
			const rolledSeals = new Set<number>();

			for (let i = 0; i < 9; ++i) {
				const url = buildGenerator.generateUrl();
				const build = buildGenerator.generateBuildFromUrl(url);

				expect(build.get(ItemCategory.Seals)).toBeDefined();
				expect(build.get(ItemCategory.Seals)).not.toBeNull();

				if (rolledSeals.has(build.get(ItemCategory.Seals)?.[0].index!)) {
					isUnique = false;
				}

				rolledSeals.add(build.get(ItemCategory.Seals)?.[0].index!);
			}

			expect(isUnique).toBe(true);
			expect(rolledSeals.size).toBe(9);
		});

		it("should generate a set of armor", () => {
			const url = buildGenerator.generateUrl();
			const build = buildGenerator.generateBuildFromUrl(url);

			expect(build.get(ItemCategory.Helm)?.length).toBe(1);
			expect(build.get(ItemCategory.Chest)?.length).toBe(1);
			expect(build.get(ItemCategory.Gauntlets)?.length).toBe(1);
			expect(build.get(ItemCategory.Leg)?.length).toBe(1);
		});

		it("should generate a unique set of armor", () => {
			let isUnique = true;

			for (let i = 0; i < 167; ++i) {
				// create a snapshot of the state of the previouslyRolled map before generating a new build
				// not using structuredClone would cause prevRolled to be a reference, so when we generate the build
				// it would reflect in prevRolled, so when we check if prevRolled has the index, it would be true
				// causing the test to throw a false-negative failure
				const prevRolled = structuredClone(buildGenerator._buildGenerationConfig.helms.previouslyRolled);

				const url = buildGenerator.generateUrl();
				const build = buildGenerator.generateBuildFromUrl(url);

				expect(build.get(ItemCategory.Helm)).toBeDefined();

				if (prevRolled.has(build.get(ItemCategory.Helm)?.[0].index!)) {
					isUnique = false;
				}
			}

			const url = buildGenerator.generateUrl();
			const build = buildGenerator.generateBuildFromUrl(url);

			// After 167 rolls, there are no available helms
			expect(build.get(ItemCategory.Helm)?.[0]).toBeUndefined();

			// The first 167 rolls should contain valid armors
			expect(buildGenerator._buildGenerationConfig.helms.previouslyRolled.has(-1)).toBe(false);

			expect(isUnique).toBe(true);
			expect(buildGenerator._buildGenerationConfig.helms.previouslyRolled.has(-1)).toBe(false);
			expect(buildGenerator._buildGenerationConfig.helms.previouslyRolled.size).toBe(167);
		});
	});
});
