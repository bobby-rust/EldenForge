import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";

import eldenRingData from "../data.json" with { type: "json" };

dotenv.config();
const sysPrompt = `You are an Elden Ring build generator. You generate Elden Ring builds in this structured format: 
Name=<Name>
Vigor=<Vigor>
Mind=<Mind>
Endurance=<Endurance>
Strength=<Strength>
Dexterity=<Dexterity>
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
Staves=<Staves>
Sorceries=<Sorceries>
Shields=<Shield>
Talismans=<Talismans>
Crystal Tears=<Crystal Tears>
Spirit Ashes=<Spirit Ashes>
Summary=<Summary>
Strengths=<Strengths>
Weaknesses=<Weaknesses>'
For the Summary, you are Sir Gideon Ofnir, The All-Knowing (Boss) from Elden Ring. You will respond as if you are him. The summary should be one paragraph.
Do not include Sacred Seals or Glintstone Staffs (a.k.a. Staves) in the Weapons category.
Make sure to give every build Talismans, Crystal Tears, and Spirit Ashes. 
Make sure to generate a full armor set for each build.
If there are multiple items for a category, separate them with a single bar (|). 
Do not use slashes (i.e. "/", "\\") in your response at all.
Do not generate more than 4 items per category.
Make sure to generate one of each armor type.
If there are no items for a category, put None.
Provide a strengths and weaknesses summary at the end.
The strengths and weaknesses should be full, grammatically correct sentences. The strengths and weaknesses should be no more than 2 sentences each.
If you generate any incantations, be sure to generate a necessary Sacred Seal used to cast it.
Make sure the items generated have the required stats to use them.
The Elden Ring item data is provided to you, so make sure to use it to generate valid builds. Do not generate items that do not exist in the game.
Here is the item data: ${JSON.stringify(filterData(eldenRingData))}`;

/**
 * Returns a json object with only the relevant fields that are useful
 * to the AI for generating builds. This is to reduce the amount of data that
 * the AI has to process and to make it easier for the AI to understand the data.
 */
function filterData(data: any) {
    const asArray = <T>(value: T[] | null | undefined): T[] =>
        Array.isArray(value) ? value : [];

    const toNumber = (value: number | string | null | undefined) => {
        if (typeof value === "number") {
            return value;
        }

        if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);

            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }

        return 0;
    };

    const compactText = (value: unknown) =>
        typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

    const toRequirementMap = (
        values: Array<{ name?: string; amount?: number | string }> | null,
    ) => {
        const keyMap: Record<string, string> = {
            Str: "strength",
            Dex: "dexterity",
            Int: "intelligence",
            Fai: "faith",
            Arc: "arcane",
            Strength: "strength",
            Dexterity: "dexterity",
            Intelligence: "intelligence",
            Faith: "faith",
            Arcane: "arcane",
        };

        return asArray(values).reduce<Record<string, number>>(
            (requirements, value) => {
                const key = value.name ? keyMap[value.name] : undefined;
                const amount = toNumber(value.amount);

                if (key && amount > 0) {
                    requirements[key] = amount;
                }

                return requirements;
            },
            {},
        );
    };

    const toScalingMap = (
        values: Array<{ name?: string; scaling?: string }> | null,
    ) => {
        const keyMap: Record<string, string> = {
            Str: "strength",
            Dex: "dexterity",
            Int: "intelligence",
            Fai: "faith",
            Arc: "arcane",
        };

        return asArray(values).reduce<Record<string, string>>(
            (scaling, value) => {
                const key = value.name ? keyMap[value.name] : undefined;
                const grade = compactText(value.scaling);

                if (key && grade) {
                    scaling[key] = grade;
                }

                return scaling;
            },
            {},
        );
    };

    const toDamageMap = (
        values: Array<{ name?: string; amount?: number | string }> | null,
    ) => {
        const keyMap: Record<string, string> = {
            Phy: "physical",
            Mag: "magic",
            Fire: "fire",
            Ligt: "lightning",
            Holy: "holy",
            Inc: "incantScaling",
            Sor: "sorceryScaling",
            Boost: "guardBoost",
        };

        return asArray(values).reduce<Record<string, number>>(
            (damage, value) => {
                const key = value.name ? keyMap[value.name] : undefined;
                const amount = toNumber(value.amount);

                if (key && amount > 0) {
                    damage[key] = amount;
                }

                return damage;
            },
            {},
        );
    };

    const toArmorPiece = (item: any) => ({
        name: item.name,
        weight: toNumber(item.weight),
    });

    const toWeapon = (item: any) => ({
        name: item.name,
        category: item.category,
        weight: toNumber(item.weight),
        requirements: toRequirementMap(item.requiredAttributes),
        scaling: toScalingMap(item.scalesWith),
        damage: toDamageMap(item.attack),
    });

    const toCatalyst = (item: any) => ({
        name: item.name,
        category: item.category,
        weight: toNumber(item.weight),
        requirements: toRequirementMap(item.requiredAttributes),
        scaling: toScalingMap(item.scalesWith),
        casting: toDamageMap(item.attack),
    });

    const toShield = (item: any) => ({
        name: item.name,
        category: item.category,
        weight: toNumber(item.weight),
        requirements: toRequirementMap(item.requiredAttributes),
        scaling: toScalingMap(item.scalesWith),
        guard: toDamageMap(item.defence),
    });

    const toSpell = (item: any) => ({
        name: item.name,
        cost: toNumber(item.cost),
        slots: toNumber(item.slots),
        requirements: toRequirementMap(item.requires),
        effect: compactText(item.effects),
    });

    const toUsableOn = (description: unknown) => {
        const match = compactText(description).match(
            /Usable on (.+?)(?:\.|$)/i,
        );

        return match?.[1] ?? "";
    };

    const armors = Array.isArray(data.armors?.items) ? data.armors.items : [];
    const weapons = Array.isArray(data.weapons?.items)
        ? data.weapons.items
        : [];

    return {
        classes: (Array.isArray(data.classes?.items)
            ? data.classes.items
            : []
        ).map((item: any) => ({
            name: item.name,
            stats: {
                level: toNumber(item.stats?.level),
                vigor: toNumber(item.stats?.vigor),
                mind: toNumber(item.stats?.mind),
                endurance: toNumber(item.stats?.endurance),
                strength: toNumber(item.stats?.strength),
                dexterity: toNumber(item.stats?.dexterity),
                intelligence: toNumber(item.stats?.intelligence),
                faith: toNumber(item.stats?.faith),
                arcane: toNumber(item.stats?.arcane),
            },
        })),
        armors: {
            helms: armors
                .filter((item: any) => item.category === "Helm")
                .map(toArmorPiece),
            chest: armors
                .filter((item: any) => item.category === "Chest Armor")
                .map(toArmorPiece),
            gauntlets: armors
                .filter((item: any) => item.category === "Gauntlets")
                .map(toArmorPiece),
            legs: armors
                .filter((item: any) => item.category === "Leg Armor")
                .map(toArmorPiece),
        },
        weapons: weapons
            .filter(
                (item: any) =>
                    item.category !== "Glintstone Staff" &&
                    item.category !== "Sacred Seal",
            )
            .map(toWeapon),
        sacredSeals: (Array.isArray(data.seals?.items)
            ? data.seals.items
            : []
        ).map(toCatalyst),
        staves: weapons
            .filter((item: any) => item.category === "Glintstone Staff")
            .map(toCatalyst),
        shields: (Array.isArray(data.shields?.items)
            ? data.shields.items
            : []
        ).map(toShield),
        ashesOfWar: (Array.isArray(data.ashes?.items) ? data.ashes.items : [])
            .filter((item: any) => compactText(item.skill))
            .map((item: any) => ({
                name: item.name,
                skill: item.skill,
                affinity: item.affinity,
                usableOn: toUsableOn(item.description),
            })),
        incantations: (Array.isArray(data.incants?.items)
            ? data.incants.items
            : []
        ).map(toSpell),
        sorceries: (Array.isArray(data.sorcs?.items)
            ? data.sorcs.items
            : []
        ).map(toSpell),
        talismans: (Array.isArray(data.talismans?.items)
            ? data.talismans.items
            : []
        ).map((item: any) => ({
            name: item.name,
            effect: compactText(item.effect),
        })),
        crystalTears: (Array.isArray(data.tears?.items)
            ? data.tears.items
            : []
        ).map((item: any) => ({
            name: item.name,
            type: item.type,
            effect: compactText(item.description),
        })),
        spiritAshes: (Array.isArray(data.spirits?.items)
            ? data.spirits.items
            : []
        ).map((item: any) => ({
            name: item.name,
            fpCost: toNumber(item.fpCost),
            hpCost: toNumber(item.hpCost),
            effect: compactText(item.effect),
        })),
    };
}

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    console.log("Handler called");

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        response.status(500).json({
            body: {
                error: "API key not found",
            },
        });
        return;
    }

    const buildTypes = [
        "Strength",
        "Dexterity",
        "Faith",
        "Arcane",
        "Intelligence",
        "Lightning Damage",
        "Holy Damage",
        "Strike Damage",
        "Slash Damage",
        "Pierce Damage",
        "Magic Damage",
        "Fire Damage",
    ];

    const buildType =
        request.body.build_type ??
        buildTypes[Math.floor(Math.random() * buildTypes.length)];

    const prompt = `Generate a ${buildType} Elden Ring build.`;

    // const model = genAI.getGenerativeModel({
    //     model: "gemini-2.0-flash-exp",
    //     systemInstruction: sysPrompt,
    // });

    // const chat = model.startChat();

    // const result = await chat.sendMessage(prompt);
    // const res = await result.response;

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
    };
    const payload = {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
            {
                role: "system",
                content: sysPrompt,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    };

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status !== 200) {
        response.status(500).json({
            body: {
                error: "Error generating build",
            },
        });
        return;
    }

    response.status(200).json({
        body: {
            build: data.choices[0].message.content,
        },
    });
}
