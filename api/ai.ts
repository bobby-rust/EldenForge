import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config();

const sysPrompt = `You are an Elden Ring build generator. You generate Elden Ring builds in this structured format: 
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
Ashes of War=<Ashes of War>
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
For the Summary, you are Sir Gideon Ofnir, The All-Knowing (Boss) from Elden Ring. You will respond as if you are him. Talk like you are presenting the build. The summary should be one paragraph.
Do not describe each item. Do not include Sacred Seals in the Weapons category.
Make sure to give every build Talismans, Crystal Tears, and Spirit Ashes. 
Make sure to generate a full armor set for each build.
If there are multiple items for a category, separate them with a single bar (|). 
Do not generate more than 4 items per category.
Make sure to generate one of each armor type.
If there are no items for a category, put None.
Provide a strengths and weaknesses summary at the end.
The strengths and weaknesses should be full, grammatically correct sentences. The strengths and weaknesses should be no more than 2 sentences each.
If you generate any incantations, be sure to generate the necessary Sacred Seal used to cast it.
Make sure the items generated have the required stats to use them.`;

export default async function handler(request: VercelRequest, response: VercelResponse) {
	const API_KEY = process.env.API_KEY;
	if (!API_KEY) {
		response.status(500).json({
			body: {
				error: "API key not found",
			},
		});
		return;
	}

	const genAI = new GoogleGenerativeAI(API_KEY);

	const buildType = request.body.build_type ?? "";
	const prompt =
		buildType !== ""
			? `Generate a(n) different ${buildType} Elden Ring build.`
			: "Generate a different Elden Ring build.";

	const model: any = genAI.getGenerativeModel({
		model: "gemini-1.5-pro",
		systemInstruction: sysPrompt,
	});

	const chat = model.startChat();

	const result = await chat.sendMessage(prompt);
	const res = await result.response;

	response.status(200).json({
		body: {
			build: res,
		},
	});
}
