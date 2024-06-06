import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../classes/Item";
import useGeneratorState from "../hooks/useGeneratorState";
import { ItemCategory } from "../types/enums";
import BuildGenerator from "../classes/BuildGenerator";

const generator = new BuildGenerator();

export default function Build() {
	const { buildUrl } = useParams();

	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	console.log("Loading page with buildUrl: ", buildUrl);
	const navigate = useNavigate();

	const [build, setBuild] = React.useState<Map<ItemCategory, Item[]> | null>(generator.generateBuildFromUrl(buildUrl));
	const { generatorState, setBuildNumsState, setExcludePreviouslyRolledState } = useGeneratorState(generator);

	const handleIncrementBuildNumsForCategory = (c: ItemCategory) => {
		setBuildNumsState(c, generatorState[c].buildNums + 1);
	};

	const handleToggleExcludePreviouslyRolledForCategory = (c: ItemCategory) => {
		setExcludePreviouslyRolledState(c, !generatorState[c].excludePreviouslyRolled);
	};

	const handleReroll = () => {
		// if i keep track of the state of the build separately, i can avoid refreshing the page
		// every time the build changes.
		const newUrl = generator.generateUrl();

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleRerollItem = (c: ItemCategory, i: number | undefined) => {
		console.log("i", i);
		if (!i) return;
		console.log("rerolling item", c, i);
		const newBuildMap = generator.rerollItem(c, i);
		console.log("Got new build map: ", newBuildMap);
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);
		console.log("got new url: ", newUrl);
		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	React.useEffect(() => {
		console.log("Current items: ", generator._items);
	}, [build]);

	return (
		<div>
			<h1>Incrementers</h1>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Weapons)}>increment num weapons</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Ashes)}>increment num ashes</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Incants)}>increment num incants</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Seals)}>increment num seals</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Sorcs)}>increment num sorcs</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Shields)}>increment num shields</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Spirits)}>increment num spirits</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Talismans)}>increment num talis</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Tears)}>increment num tear</button>

			<button onClick={handleReroll}>
				<h1>reroll</h1>
			</button>

			<h1>Toggles</h1>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Weapons)}>
				toggle weapons
			</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Ashes)}>
				toggle exclude previously rolled ashes
			</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Incants)}>incants</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Seals)}>seals</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Sorcs)}>sorcs</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Shields)}>shields</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Spirits)}>spirits</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Talismans)}>talis</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Tears)}>tear</button>
			<h1>{generatorState.weapons.buildNums}</h1>

			<div>
				<h1>Build</h1>
				{build &&
					// yeah dont ask
					[...build.keys()].map((c: ItemCategory) =>
						build.get(c)?.map((i: Item, j: number) => {
							return (
								<div key={j}>
									<h3>{i.category}</h3>
									<p>{i.name}</p>
									<button onClick={() => handleRerollItem(c, i.index)}>reroll item</button>
								</div>
							);
						})
					)}{" "}
			</div>
		</div>
	);
}
