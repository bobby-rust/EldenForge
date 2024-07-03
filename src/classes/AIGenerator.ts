import data from "../data/new_new_data.json";
import { ItemCategory } from "../types/enums";
import { Item } from "./Item";
import { AIBuildType } from "../types/types";
import BuildGenerator from "./BuildGenerator";

export default class AI {
	/**
	 * Prompts the LLM and returns the response
	 * @returns {Promise<string>} the AI response
	 */
	public async getAIBuild(buildType: string): Promise<AIBuildType> {
		const r = await fetch("/api/ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				build_type: buildType,
			}),
		});

		const res = await r.json();

		return this.parseResponse(res.body.build.candidates[0].content.parts[0].text);
	}

	/**
	 * Parses the AI response into an AIBuild
	 * @returns {AIBuild} the AI build
	 */
	private parseResponse(res: string): AIBuildType {
		const responseArray = res.split("\n");
		const buildArray: string[][] = [];

		responseArray.forEach((el: string) => {
			let currKeyValPair = el.trim().split("=");
			if (typeof currKeyValPair[1] === "undefined") return;

			buildArray.push(currKeyValPair);
		});

		const buildMap = this.createBuildMap(buildArray);
		const generator = new BuildGenerator();
		return this.createAIBuild(generator.parseBuildFromMap(buildMap), responseArray);
	}

	/**
	 * Creates an AIBuild object from the given buildMap and aiResponseArray.
	 *
	 * @param {Map<ItemCategory, number[]>} buildMap - A map of item categories to an array of item IDs.
	 * @param {string[]} aiResponseArray - An array of strings representing the AI response.
	 * @return {AIBuild} The created AIBuild object.
	 */
	private createAIBuild(buildMap: Map<ItemCategory, Item[]>, aiResponseArray: string[]): AIBuildType {
		const build: AIBuildType = {
			name: "",
			summary: "",
			strengths: "",
			weaknesses: "",

			vigor: 0,
			mind: 0,
			endurance: 0,
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			faith: 0,
			arcane: 0,

			items: buildMap,
		};

		aiResponseArray.map((el: string) => {
			let currKeyValPair = el.trim().split("=");
			currKeyValPair[0] = currKeyValPair[0].toLowerCase();
			if (currKeyValPair[0] === "name") build.name = currKeyValPair[1];
			if (currKeyValPair[0] === "summary") build.summary = currKeyValPair[1].replaceAll("?", "%3F"); // %3F is the encoding for a question mark
			if (currKeyValPair[0] === "strengths") build.strengths = currKeyValPair[1];
			if (currKeyValPair[0] === "weaknesses") build.weaknesses = currKeyValPair[1];

			if (currKeyValPair[0] === "vigor") build.vigor = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "mind") build.mind = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "endurance") build.endurance = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "strength") build.strength = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "dexterity") build.dexterity = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "intelligence") build.intelligence = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "faith") build.faith = parseInt(currKeyValPair[1]);
			if (currKeyValPair[0] === "arcane") build.arcane = parseInt(currKeyValPair[1]);
		});

		return build;
	}

	/**
	 * Creates a build map from an array of arrays of key, value pairs.
	 * @param arr An array containing arrays of key, value pairs where they key is the category and the value is the name of the item.
	 * @returns {Map<string, number[]>} a map representing a build.
	 */
	private createBuildMap(arr: string[][]): Map<ItemCategory, number[]> {
		const buildMap = new Map<ItemCategory, number[]>();

		arr.forEach((kvPair: string[]) => {
			if (kvPair[0] === "") return;

			const key = this.translateResponseCategory(kvPair[0]);
			if (key === "") return;

			const value = kvPair[1];

			const names = value.split("|");
			names.forEach((name) => {
				if (name.toLowerCase() === "none") return;
				if (!name) return;
				const item = this.getItemFromName(key, name);
				buildMap.set(key as ItemCategory, [...(buildMap.get(key as ItemCategory) ?? []), item]);
			});
		});

		return buildMap;
	}

	/**
	 * Gets the index of the item by its name.
	 * @param type the type of item to retrieve
	 * @param name the name of the item
	 * @returns {number} the index of the item in the raw data
	 */
	public getItemFromName(type: string, name: string): number {
		if (type === ItemCategory.Weapons && name.includes("Seal")) {
			// Seals are their own category, but the AI thinks of them as weapons.
			type = ItemCategory.Seals;
		}

		let items = data[type as keyof typeof data]["items"];

		const distances: number[] = [];
		for (let i = 0; i < data[type as keyof typeof data]["count"]; ++i) {
			const cmp =
				type !== ItemCategory.Ashes
					? this.isCloseMatch(name, items[i].name)
					: // @ts-expect-error
					  this.isCloseMatch(name, items[i].skill);

			if (cmp.match) {
				return i;
			}

			distances.push(cmp.distance);
		}

		return distances.indexOf(Math.min(...distances));
	}

	/**
	 * Checks if two strings are close matches based on the Levenshtein distance.
	 *
	 * @param {string} s1 - The first string.
	 * @param {string} s2 - The second string.
	 * @return {Object} An object containing the match status and the distance.
	 *   - {boolean} match - True if the strings are close matches, false otherwise.
	 *   - {number} distance - The Levenshtein distance between the two strings.
	 */
	private isCloseMatch(s1: string, s2: string): { match: boolean; distance: number } {
		const dist = this.levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
		return dist < 3 ? { match: true, distance: dist } : { match: false, distance: dist };
	}

	/**
	 * Calculates the Levenshtein distance between two strings.
	 *
	 * @param {string} s - The first string.
	 * @param {string} t - The second string.
	 * @return {number} The Levenshtein distance between the two strings.
	 */
	private levenshteinDistance(s: string, t: string): number {
		if (!s.length) return t.length;
		if (!t.length) return s.length;
		const arr = [];
		for (let i = 0; i <= t.length; i++) {
			arr[i] = [i];
			for (let j = 1; j <= s.length; j++) {
				arr[i][j] =
					i === 0
						? j
						: Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1));
			}
		}
		return arr[t.length][s.length];
	}

	/**
	 * Translates the category from the given response string into the form used by the BuildGenerator.
	 *
	 * @param {string} cat - The category string as received from the AI.
	 * @return {string} The parsed category string in the form used by the BuildGenerator.
	 */
	private translateResponseCategory(cat: string): string {
		switch (cat.toLowerCase()) {
			case "class":
				return "classes";
			case "weapons":
				return "weapons";
			case "helm":
				return "helms";
			case "chest armor":
				return "chests";
			case "gauntlets" || "gauntlet":
				return "gauntlets";
			case "leg armor":
				return "legs";
			case "shields":
				return "shields";
			case "talismans":
				return "talismans";
			case "sorceries":
				return "sorcs";
			case "incantations":
				return "incants";
			case "sacred seals":
				return "seals";
			case "crystal tears":
				return "tears";
			case "spirit ashes":
				return "spirits";
			case "ashes of war":
				return "ashes";
			default:
				return "";
		}
	}
}
