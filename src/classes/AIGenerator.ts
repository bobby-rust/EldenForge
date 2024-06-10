import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import data from "../data/new_data.json";
import { ItemCategory } from "../types/enums";

export default class AI {
	private _API_KEY: string = import.meta.env.VITE_API_KEY;
	private _genAI = new GoogleGenerativeAI(this._API_KEY);

	private _generationConfig: GenerationConfig = {
		temperature: 1, // maximum randomness
		topP: 1, // The cumulative probability of potential tokens in which to stop considering subsequent tokens, 1.0 is max
		topK: 50, // Consider the top K tokens
	};

	private _model: any = this._genAI.getGenerativeModel({
		...this._generationConfig,
		model: "gemini-1.5-pro",
		systemInstruction: `You are an Elden Ring build generator. You generate unique and creative Elden Ring builds in this structured format: 
    Name=<Name>
    Vigor=<Vigor>
    Mind=<Mind>
    Endurance=<Endurance>
    Strength=<Strength>
    Dexterity=<Dexterify>
    Intelligence=<Intelligence>
    Faith=<Faith>
    Arcane=<Arcane>
    Class=<Class>
    Helm=<helmet>
    Chest Armor=<Chest Armor>
    Gauntlets=<Gauntlets>
    Leg Armor=<Leg Armor>
    Weapons=<Weapons>
    Ashes 0f War=<Ashes of War>
    Sacred Seals=<Sacred Seals>
    Incantations=<Incantations>
    Shields=<Shield>
    Talismans=<Talismans>
    Crystal Tears=<Crystal Tears>
    Spirit Ashes=<Spirit Ashes>
    Sorceries=<Sorceries>
    Summary=<Summary>
    Strengths=<Strengths>
    Weaknesses=<Weaknesses>'
    Do not describe each item. Do not include Sacred Seals in the Weapons category.
    Make sure to give every build Talismans, Crystal Tears, and Spirit Ashes. 
    Make sure to generate a full armor set for each build.
    If there are multiple items for a category, separate them with a single bar (|). Put single quotes around each item name.
    Do not generate more than 4 items per category.
    Make sure to generate one of each armor type.
    If there are no items for a category, put 'None'.
    Provide a strengths and weaknesses summary at the end.
    Use the exact item names as they appear in the following data. Select items using the following data which contains information about Elden Ring items: ${data}`,
	});
	private _prompt = `Generate an Elden Ring build.`;

	constructor() {
		console.log("New AI initialized");
	}

	/**
	 * Prompts the LLM and returns the response
	 * @returns {Promise<string>} the AI response
	 */
	public async getAIBuild(): Promise<Map<ItemCategory, number[]>> {
		const result = await this._model.generateContent(this._prompt);
		const response = await result.response;
		const text = response.text();
		const buildMap = this.parseResponse(text);
		console.log(text);

		return buildMap;
	}

	/**
	 * Parses the AI response into a build map
	 * @returns {Map<ItemCategory, number[]>} the build map
	 */
	private parseResponse(res: string): Map<ItemCategory, number[]> {
		const responseArray = res.split("\n");
		const mapArray: string[][] = [];
		responseArray.forEach((el: string) => {
			let currKeyValPair = el.trim().split("=");
			let name = "";
			currKeyValPair[0] = currKeyValPair[0];
			if (typeof currKeyValPair[1] === "undefined") return;
			for (let i = 0; i < currKeyValPair[1].length; i++) {
				if (currKeyValPair[1][i] !== "'") {
					name += currKeyValPair[1][i];
				}
			}

			currKeyValPair[1] = name.trim();
			mapArray.push(currKeyValPair);
		});

		return this.createBuildMap(mapArray);
	}

	/**
	 * Creates a build map from an array of arrays of key, value pairs.
	 * @param arr An array containing arrays of key, value pairs where they key is the category and the value is the name of the item.
	 * @returns {Map<string, number[]>} a map representing a build.
	 */
	private createBuildMap(arr: string[][]): Map<ItemCategory, number[]> {
		const buildMap = new Map<ItemCategory, number[]>();
		arr.forEach((kvPair: string[]) => {
			const key = this.translateResponseCategory(kvPair[0]);
			if (key === "") return;

			const value = kvPair[1];

			const names = value.split("|");
			names.forEach((name) => {
				if (name.toLowerCase() === "'none'" || name.toLowerCase() === "none") return;
				const item = this.getItemFromName(key, name);
				buildMap.set(key as ItemCategory, [...(buildMap.get(key as ItemCategory) ?? []), item]);
			});
		});

		return buildMap;
	}

	/**
	 * Gets the index of the item by its name, or -1 if the item was not found.
	 * @param type the type of item to retrieve
	 * @param name the name of the item
	 * @returns {number} the index of the item in the raw data
	 */
	private getItemFromName(type: string, name: string): number {
		if (type === ItemCategory.Ashes) {
			name += " Ashes";
		}

		if (type === ItemCategory.Weapons && name.split(" ")[-1] === "Seal") {
			type = ItemCategory.Seals;
		}

		const items = data[type as keyof typeof data]["items"];

		const distances: number[] = [];
		for (let i = 0; i < data[type as keyof typeof data]["count"]; ++i) {
			const dist = this.levenshteinDistance(name.toLowerCase(), items[i].name.toLowerCase());
			if (dist < 3) {
				return i;
			} else {
				distances.push(dist);
			}
		}

		const index = distances.indexOf(Math.min(...distances));
		return index;
	}

	private levenshteinDistance(s: string, t: string) {
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
		if (cat === "Crystal Tears") {
			// Am I going crazy or WHAT, WHY IS THIS NECESSARY?
			return "tears";
		}

		//TODO: Fix this. This is bad. No magic strings.
		switch (cat.toLowerCase().trim()) {
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
			case "shields" || "sorceries" || "talismans":
				return cat.toLowerCase();
			case "incantations":
				return "incants";
			case "sacred seals" || "crystal tears":
				console.log("Got a hit.");
				return cat.split(" ")[1].toLowerCase();
			case "spirit ashes":
				return "spirits";
			case "ashes of war":
				return "ashes";
			default:
				console.log("Invalid category.");
				return "";
		}
	}
}
