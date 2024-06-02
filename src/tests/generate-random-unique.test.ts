import { describe, it, expect, beforeEach } from "vitest";
import BuildGenerator from "../classes/BuildGenerator";

describe("BuildGenerator generateUrl", () => {
	let buildGenerator: BuildGenerator;
	beforeEach(() => {
		buildGenerator = new BuildGenerator();
	});

	it("should generate a non-unique build when _excludePreviouslyRolled is false", () => {
		buildGenerator._excludePreviouslyRolled = false;
		let isNonUnique = false;
		buildGenerator._buildNums.seals = 1;
		const rolledSeals = new Set<number>();
		for (let i = 0; i < 1000; ++i) {
			// *Extremely* likely that after 1000 iterations a non-unique seal will be rolled, there are only 10 seals in the game.
			const result = buildGenerator.generateUrl();
			const build = buildGenerator.generateBuildFromUrl(result);

			if (rolledSeals.has(build._seals[0].index)) {
				isNonUnique = true;
				break;
			}
			rolledSeals.add(build._seals[0].index);
		}

		expect(isNonUnique).toBe(true);
	});

	it("should generate a unique build when _excludePreviouslyRolled is true", () => {
		let isUnique = true;
		buildGenerator._buildNums.seals = 1;
		buildGenerator._excludePreviouslyRolled = true;
		const rolledSeals = new Set<number>();

		for (let i = 0; i < 9; ++i) {
			const result = buildGenerator.generateUrl();
			const build = buildGenerator.generateBuildFromUrl(result);

			expect(build._seals).toBeDefined();
			expect(build._seals).not.toBeNull();
			// console.log("Build.seals[0]: ", build._seals);

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

	it("should return a string", () => {
		const result = buildGenerator.generateUrl();
		expect(typeof result).toBe("string");
	});
});
