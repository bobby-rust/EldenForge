import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import BuildGenerator from "./BuildGenerator";

export class AIWrapper {
	private _API_KEY: string = import.meta.env.VITE_API_KEY;
	private _genAI = new GoogleGenerativeAI(this._API_KEY);

	private _generationConfig: GenerationConfig = {
		temperature: 1.0, // Maximum randomness
		topP: 1.0, // The cumulative probability of potential tokens in which to stop considering subsequent tokens, 1.0 is max
		topK: 50, // Consider the top K tokens
	};

	private _model: any = this._genAI.getGenerativeModel({ ...this._generationConfig, model: "gemini-1.5-pro" });
	private _prompt = import.meta.env.VITE_PROMPT;

	private _generator = new BuildGenerator();

	constructor() {
		console.log("New AIWrapper initialized.");
	}

	/**
	 * Prompts the LLM and returns the response
	 * @returns {Promise<string>} the AI response
	 */
	async queryAI(): Promise<string> {
		const result = await this._model.generateContent(this._prompt);
		const response = await result.response;
		const text = response.text();
		console.log(text);
		return text;
	}

	/**
	 * Parses the AI response into a build URL
	 * @returns {string} the build url
	 */
	parseResponse(): string {
		const url = "";
		const response = `Name=Oathbound Duelist
        Vigor=40
        Mind=16
        Endurance=25
        Strength=18
        Dexterity=40
        Intelligence=9
        Faith=12
        Arcane=7
        Class=Samurai
        Weapons='Uchigatana' | 'Regalia of Eochaid'
        Ashes 0f War='Ash Of War: Barrage' | 'Ash Of War: Prelate's Charge'
        Helm='None'
        Chest Armor='Ronin's Armor'
        Gauntlets='None'
        Leg Armor='Ronin's Greaves'
        Crystal Tears='Cerulean Hidden Tear'
        Incantations='Golden Vow' | 'Flame, Grant Me Strength'
        Sacred Seals='None'
        Shields='None'
        Sorceries='None'
        Spirit Ashes='Black Knife Tiche'
        Talismans='Rotten Winged Sword Insignia' | 'Lord of Blood's Exultation' | 'Green Turtle Talisman' | 'Carian Filigreed Crest'
        Summary=This build is a glass cannon bleed/Dex build that utilizes the unique combination of 'Uchigatana' and 'Regalia of Eochaid' to inflict bleed quickly with high damage output.  It uses minimal armor to maintain light equip load and prioritize dodging and mobility. The 'Black Knife Tiche' ashes supplement the player's damage and stagger enemies.
        Strengths=Very high damage output | Extremely mobile | Good stagger potential | Can inflict bleed quickly
        Weaknesses=Very low defense | Requires precise dodging and spacing | Susceptible to crowd control | Low FP`;

		// needs to parse the response into a build map -> Map<string, number[]>

		const responseArray = response.split("\n");
		const mapArray: string[][] = [];
		responseArray.forEach((el: string) => {
			const currKeyValPair = el.trim().split("=");
			mapArray.push(currKeyValPair);
		});

		const buildMap = this.createBuildMap(mapArray);
		// console.log(buildMap);
		return url;
	}

	/**
	 * Creates a build map from an array of arrays of key, value pairs.
	 * @param arr An array containing arrays of key, value pairs where they key is the category and the value is the name of the item.
	 * @returns {Map<string, number[]>} a map representing a build.
	 */
	private createBuildMap(arr: string[][]): Map<string, number[]> {
		const buildMap = new Map<string, number[]>();

		arr.forEach((kvPair: string[]) => {
			const key = this.translateResponseCategory(kvPair[0]);

			if (key === "") return;

			const value = kvPair[1];

			const names = value.split("|");
			// console.log(names);
			names.forEach((name) => {
				const item = this._generator.getItemFromName(key, name);
				buildMap.set(key, [...(buildMap.get(key) ?? []), item]);
			});
		});

		return buildMap;
	}

	/**
	 * Translates the category from the given response string into the form used by the BuildGenerator.
	 *
	 * @param {string} cat - The category string as received from the AI.
	 * @return {string} The parsed category string in the form used by the BuildGenerator.
	 */
	private translateResponseCategory(cat: string): string {
		//TODO: Fix this. This is bad. No magic strings.
		switch (cat) {
			case "Class":
				return "classes";
			case "Weapons":
				return "weapons";
			case "Helm" || "Chest Armor" || "Leg Armor" || "Gauntlets":
				return "armors";
			case "Shields" || "Sorceries" || "Talismans":
				return cat.toLowerCase();
			case "Incantations":
				return "incants";
			case "Sacred Seals" || "Crystal Tears":
				return cat.split(" ")[1].toLowerCase();
			case "Spirit Ashes":
				return "spirits";
			case "Ashes 0f War":
				return "ashes";
			default:
				console.log("Invalid category.");
				return "";
		}
	}
}
