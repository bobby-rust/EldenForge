import { ItemCategory } from "./enums";

export const ArmorCategories = new Set([
	ItemCategory.Helm,
	ItemCategory.Chest,
	ItemCategory.Gauntlets,
	ItemCategory.Leg,
]);

export const readableItemCategory = new Map<ItemCategory, string>([
	[ItemCategory.Weapons, "Weapons"],
	[ItemCategory.Helm, "Armors"],
	[ItemCategory.Ashes, "Ashes Of War"],
	[ItemCategory.Incants, "Incantations"],
	[ItemCategory.Sorcs, "Sorceries"],
	[ItemCategory.Talismans, "Talismans"],
	[ItemCategory.Spirits, "Spirit Ashes"],
	[ItemCategory.Shields, "Shields"],
	[ItemCategory.Tears, "Crystal Tears"],
	[ItemCategory.Seals, "Sacred Seals"],
]);

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

interface NUM_SOTE_ITEMS {
	[key: string]: number;
}

export const NUM_SOTE_ITEMS: NUM_SOTE_ITEMS = {
	weapons: 90,
	ashes: 25,
	sorcs: 14,
	incants: 28,
	talismans: 39,
	spirits: 20,
	shields: 8,
	seals: 3,
	helms: 43,
	chests: 43,
	gauntlets: 29,
	legs: 30,
};

export default sysPrompt;

export const quotes = [
	[
		[
			"I dreamt for so long. My flesh was dull gold... and my blood, rotted. Corpse after corpse, left in my wake. As I awaited... his return. Heed my words. I am Malenia. Blade of Miquella. And I have never known defeat.",
		],

		["Malenia, Blade of Miquella"],
	],
	[
		[
			"Mighty dragon, thou'rt a trueborn heir. Lend me thy strength, o kindred. Deliver me unto greater heights. Well... a lowly Tarnished playing as a lord. I command thee, kneel! I am the lord of all that is golden!",
		],
		["Godrick the Grafted"],
	],
	[
		["Wait. The scarlet bloom flowers once more. You will witness true horror. Now, rot!"],
		["Malenia, Blade of Miquella"],
	],
	[
		["Well, thou art of passing skill. Warrior blood must truly run in thy veins, Tarnished."],
		["Margit, The Fell Omen"],
	],
	[["Thou'rt unfit even to graft."], ["Godrick the Grafted"]],
	[["Brave Tarnished, 'twas nobly fought."], ["Godfrey, First Elden Lord"]],
	[
		[
			"Foul Tarnished, in search of the Elden Ring. Emboldened by the flame of ambition. Someone must extinguish thy flame. Let it be Margit the Fell.",
		],
		["Margit, The Fell Omen"],
	],
	[["Thy faith Leith under my moon."], ["Rennala, Queen of the Full Moon"]],
	[
		["Dearest Miquella, you must abide alone awhile. Welcome, honored guest, to the birthplace of our dynasty!"],
		["Mohg, Lord of Blood"],
	],
	[
		[
			"Upon my name is Ranni the Witch. Mother's rich slumber shall not be disturbed by thee. Foul trespasser, send word far and wide. Of the last Queen of Caria, Rennalla of the Full Moon. And the majesty of the night she conjureth.",
		],
		["Ranni the Witch"],
	],
	[
		[
			"Your strength... extraordinary... The mark of a true Lord. Dear Miquella, dearest Miquella, my brother... I'm sorry, I finally met my match.",
		],
		["Malenia, Blade of Miquella"],
	],
	[
		[
			"That will be all. Thou didst me good service, Serosh. I've given thee courtesy, enough. Now I fight as Hourah Loux! Warrior!",
		],
		["Godfrey, First Elden Lord"],
	],
	[["The one who walks alongside flame shall one day meet the road of Destined Death. Good-bye."], ["Melina"]],
	[["You, please, I can read them. Your fingers, please, your fingers..."], ["Finger Reader Crones"]],
	[["Unfortunately for you, however, you are maidenless."], ["White Mask Varre"]],
	[["Arise now, ye Tarnished. Ye dead, who yet live."], ["Narrator"]],
	[["Before we begin, allow me to paint you the full picture."], ["Witch-Hunter Jerren"]],
	[
		["Ah... Thou... Is it thy wish to be born anew? To become a sweeting, reborn of my beloved egg?"],
		["Rennala, Queen of the Full Moon"],
	],
	[["Now, we can devour the gods, together!"], ["Rykard, Lord of Blasphemy"]],
	[["O, Death. O Destined Death... Become my blade, once more."], ["Maliketh, the Black Blade"]],
	[
		[
			"Ahh, I knew you'd come. To stand before the Elden Ring. To become Elden Lord. What a sad state of affairs. \
            I commend your spirit, but alas, none shall take the throne. Queen Marika has high hopes for us. That we continue to \
		    struggle. Unto eternity.",
		],
		["Sir Gideon Ofnir, the All-Knowing"],
	],
];

export const themes = [
	"light",
	"dark",
	"cupcake",
	"bumblebee",
	"emerald",
	"corporate",
	"synthwave",
	"retro",
	"cyberpunk",
	"valentine",
	"halloween",
	"garden",
	"forest",
	"aqua",
	"lofi",
	"pastel",
	"fantasy",
	"wireframe",
	"black",
	"luxury",
	"dracula",
	"cmyk",
	"autumn",
	"business",
	"acid",
	"lemonade",
	"night",
	"coffee",
	"winter",
	"dim",
	"nord",
	"sunset",
];
