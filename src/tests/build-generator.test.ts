import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory, UIItemCategory } from "../types/enums";
import data from "../data/data.json";
import { defaultBuildGenerationConfig } from "@/types/types";

describe("generator", () => {
	let generator: BuildGenerator;

	beforeEach(() => {
		// generator.instance = undefined;
		generator = new BuildGenerator();
	});

	describe("generateUrl", () => {
		it("should return a url of the correct form", () => {
			const b64Url = generator.generateUrl();
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
				generator._buildGenerationConfig.buildInfo.categoryConfigs.get(ItemCategory.Seals)!.excludePreviouslyRolled = false;

				let isNonUnique = false;
				const rolledItems = new Map<UIItemCategory, Set<number>>();

				for (let i = 0; i < 10000; ++i) {
					const url = generator.generateUrl();
					const build = generator.generateBuildFromUrl(url);

					if (rolledItems.get(UIItemCategory.Seals)?.has(build.get(UIItemCategory.Seals)?.[0].index!)) {
						isNonUnique = true;
						break;
					}

					rolledItems.get(UIItemCategory.Seals)?.add(build.get(UIItemCategory.Seals)?.[0].index!);
				}

				expect(isNonUnique).toBe(true);
			};

		it("should generate a unique build", () => {
			let isUnique = true;
			generator._buildGenerationConfig = structuredClone(defaultBuildGenerationConfig);
			generator._buildGenerationConfig.buildInfo.categoryConfigs.get(ItemCategory.Seals)!.buildNums = 1;
			generator._buildGenerationConfig.buildInfo.categoryConfigs.get(ItemCategory.Seals)!.excludePreviouslyRolled = true;
			const rolledSeals = new Set<number>();

			for (let i = 0; i < data[ItemCategory.Seals]["count"]; ++i) {
				// console.log("available items before generating: ", generator._baseGameItems[ItemCategory.Seals].concat(generator._dlcItems[ItemCategory.Seals]));
				const url = generator.generateUrl();
				generator.generateBuildFromUrl(url);
				const seals = generator._build._items.get(ItemCategory.Seals);
				expect(seals).toBeDefined();
				expect(seals).not.toBeNull();
				expect(seals?.length).toBe(1);
				console.log("Generated seal: ", seals?.[0]);

				console.log("available items after generating: ", generator._baseGameItems[ItemCategory.Seals].concat(generator._dlcItems[ItemCategory.Seals]));

				if (rolledSeals.has(seals?.[0] ?? -1)) {
					isUnique = false;
					break;
				}

				rolledSeals.add(seals?.[0] ?? -1);
			}

			const url = generator.generateUrl();
			generator.generateBuildFromUrl(url);
			const seals = generator._build._items.get(ItemCategory.Seals);

			expect(seals).toBeDefined();
			expect(seals?.length).toBe(0);

			expect(isUnique).toBe(true);
			expect(rolledSeals.size).toBe(12);
		});

		it("should generate a set of armor", () => {
			const url = generator.generateUrl();
			const build = generator.generateBuildFromUrl(url);

			expect(build.get(UIItemCategory.Armors)?.length).toBe(4);
		});

		it("should generate a unique set of armor", () => {
			let isUnique = true;
			const rolledHelms = new Set<number>();
			for (let i = 0; i < data[ItemCategory.Helm]["count"]; ++i) {
				// create a snapshot of the state of the previouslyRolled map before generating a new build
				// not using structuredClone would cause prevRolled to be a reference, so when we generate the build
				// it would reflect in prevRolled, so when we check if prevRolled has the index, it would be true
				// causing the test to throw a false-negative failure

				const url = generator.generateUrl();
				const build = generator.generateBuildFromUrl(url);

				expect(build.get(UIItemCategory.Armors)).toBeDefined();
				expect(build.get(UIItemCategory.Armors)).not.toBeNull();

				const currHelm = build.get(UIItemCategory.Armors)?.[0].index!;

				if (rolledHelms.has(currHelm)) {
					isUnique = false;
					break;
				}

				rolledHelms.add(currHelm);
			}

			const url = generator.generateUrl();
			const build = generator.generateBuildFromUrl(url);

			// After count rolls, there are no available helms
			expect(build.get(UIItemCategory.Armors)?.length).toBe(1);

			expect(isUnique).toBe(true);

			const numBaseGameHelms = generator._baseGameItems[ItemCategory.Helm].length;
			const numDlcHelms = generator._dlcItems[ItemCategory.Helm].length;
			expect(numBaseGameHelms + numDlcHelms).toBe(0);
		});

		it("should generate only the categories specified", () => {
			generator._buildGenerationConfig.buildInfo.enabledCategories.delete(ItemCategory.Spirits);
			const url = generator.generateUrl();
			const build = generator.generateBuildFromUrl(url);
			expect(build.get(UIItemCategory.Spirits)?.length).toBe(0);
		});
	});
});
