import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import data from "../data/new_data.json";
import { ItemCategory } from "../types/enums";
import { sysPrompt } from "../types/constants";
import { Item } from "./Item";
import { AIBuild } from "../types/types";

export default class AI {
	private _API_KEY: string = import.meta.env.VITE_API_KEY;
	private _genAI = new GoogleGenerativeAI(this._API_KEY);

	private _generationConfig: GenerationConfig = {
		temperature: 1, // maximum randomness
		topP: 1, // The cumulative probability of potential tokens in which to stop considering subsequent tokens, 1.0 is max
		topK: 50, // Consider the top K tokens
	};

	private _prevRolledNames: string = "";
	private _prompt: string;

	constructor(prevRolledNames: string[], buildType: string) {
		this._prompt = buildType !== "" ? `Generate a(n) ${buildType} Elden Ring build.` : "Generate an Elden Ring build.";
		this._prevRolledNames = prevRolledNames.length > 0 ? prevRolledNames.join(", ") : "";
	}

	private _model: any = this._genAI.getGenerativeModel({
		...this._generationConfig,
		model: "gemini-1.5-pro",
		systemInstruction: sysPrompt + this._prevRolledNames,
	});

	/**
	 * Prompts the LLM and returns the response
	 * @returns {Promise<string>} the AI response
	 */
	public async getAIBuild(): Promise<AIBuild> {
		const result = await this._model.generateContent(this._prompt);
		const response = await result.response;

		return this.parseResponse(response.text());
	}

	/**
	 * Parses the AI response into an AIBuild
	 * @returns {AIBuild} the AI build
	 */
	private parseResponse(res: string): AIBuild {
		const responseArray = res.split("\n");
		const buildArray: string[][] = [];

		responseArray.forEach((el: string) => {
			let currKeyValPair = el.trim().split("=");
			if (typeof currKeyValPair[1] === "undefined") return;

			buildArray.push(currKeyValPair);
		});

		const buildMap = this.createBuildMap(buildArray);

		return this.createAIBuild(buildMap, responseArray);
	}

	/**
	 * Creates an AIBuild object from the given buildMap and aiResponseArray.
	 *
	 * @param {Map<ItemCategory, number[]>} buildMap - A map of item categories to an array of item IDs.
	 * @param {string[]} aiResponseArray - An array of strings representing the AI response.
	 * @return {AIBuild} The created AIBuild object.
	 */
	private createAIBuild(buildMap: Map<ItemCategory, number[]>, aiResponseArray: string[]): AIBuild {
		const build: AIBuild = {
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
			let currKeyValPair = el.trim().toLowerCase().split("=");
			if (currKeyValPair[0] === "name") build.name = currKeyValPair[1];
			if (currKeyValPair[0] === "summary") build.summary = currKeyValPair[1];
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
			const value = kvPair[1];

			const names = value.split("|");

			names.forEach((name) => {
				if (name.toLowerCase() === "none") return;

				const item = this.getItemFromName(key, name);
				if (typeof item === "object") {
					item.ashIsIncant
						? buildMap.set(ItemCategory.Incants, [...(buildMap.get(ItemCategory.Incants) ?? []), item.i])
						: null;
				} else {
					buildMap.set(key as ItemCategory, [...(buildMap.get(key as ItemCategory) ?? []), item]);
				}
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
	public getItemFromName(type: string, name: string): number | { ashIsIncant: boolean; i: number } {
		if (type === ItemCategory.Weapons && name.includes("Seal")) {
			// Seals are their own category, but the AI thinks of them as weapons.
			type = ItemCategory.Seals;
		}

		let items = data[type as keyof typeof data]["items"];

		const distances: number[] = [];
		for (let i = 0; i < data[type as keyof typeof data]["count"]; ++i) {
			const cmp = this.isCloseMatch(name, items[i].name);
			if (cmp.match) {
				return i;
			}

			distances.push(cmp.distance);

			// Sometimes the AI generates the Ash's affinity name instead of it's actual name, here we check the affinity names.
			if (type === ItemCategory.Ashes) {
				const ash = data[ItemCategory.Ashes]["items"][i] as unknown as Item;

				const cmp = this.isCloseMatch(name, ash.affinity!);
				if (cmp.match) {
					return i;
				}

				distances.push(cmp.distance);
			}
		}

		// If the item is an Ash, check the incantations too, the AI sometimes mixes them up.
		if (type === ItemCategory.Ashes) {
			items = data[ItemCategory.Incants]["items"];

			for (let i = 0; i < data[ItemCategory.Incants]["count"]; ++i) {
				const cmp = this.isCloseMatch(name, items[i].name);
				if (cmp.match) {
					return { ashIsIncant: true, i: i };
				}
			}
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
				return cat.toLowerCase();
			case "talismans":
				return "talismans";
			case "sorceries":
				return "sorcs";
			case "incantations":
				return "incants";
			case "sacred seals" || "crystal tears":
				return cat.split(" ")[1].toLowerCase();
			case "spirit ashes":
				return "spirits";
			case "ashes of war":
				return "ashes";
			default:
				console.log("Invalid category: ", cat);
				return "";
		}
	}
}
