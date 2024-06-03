import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";

describe("BuildGenerator", () => {
	describe("generateUrl", () => {
		let buildGenerator: BuildGenerator;
		beforeEach(() => {
			buildGenerator = new BuildGenerator();
		});

		describe("generateRandom", () => {
			it("should generate a random build url"),
				() => {
					buildGenerator._excludePreviouslyRolled = false;
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
						const result = buildGenerator.generateUrl();
						const build = buildGenerator.generateBuildFromUrl(result);

						if (rolledSeals.has(build._seals[0].index)) {
							isNonUnique = true;
							break;
						}
						rolledSeals.add(build._seals[0].index);
					}

					expect(isNonUnique).toBe(true);
				};
		});

		describe("generateRandomUnique", () => {
			it("should generate a unique build url", () => {
				let isUnique = true;
				buildGenerator._buildNums.seals = 1;
				buildGenerator._excludePreviouslyRolled = true;
				const rolledSeals = new Set<number>();

				for (let i = 0; i < 9; ++i) {
					const result = buildGenerator.generateUrl();
					const build = buildGenerator.generateBuildFromUrl(result);

					expect(build._seals).toBeDefined();
					expect(build._seals).not.toBeNull();

					if (build._seals.length === 0) {
						continue;
					}

					if (rolledSeals.has(build._seals[0].index)) {
						isUnique = false;
					}

					rolledSeals.add(build._seals[0].index);
					console.log("ROLLED SEALS: ", rolledSeals);
				}

				expect(isUnique).toBe(true);
				expect(rolledSeals.size).toBe(9);
			});
		});

		it("should return a string of the correct form", () => {
			const result = buildGenerator.generateUrl();
			expect(typeof result).toBe("string");
			const url = atob(result);
			console.log(url);
			const regexp = new RegExp("&(?:[a-zA-Z]+=[0-9]{1,3}(?:,[0-9]{1,3}){0,3}|[a-zA-Z]+=&)+");
			expect(regexp.test(url)).toBe(true);
		});
	});
});
