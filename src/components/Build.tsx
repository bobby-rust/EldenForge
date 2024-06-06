import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../classes/Item";
import useGeneratorState from "../hooks/useGeneratorState";
import { ItemCategory } from "../types/enums";
import BuildGenerator from "../classes/BuildGenerator";
import Navbar from "./Navbar";
import Card from "./Card";

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
		<div data-theme="fantasy">
			<Navbar />
			<div className="flex w-full justify-center align-center">
				<button className="btn" onClick={handleReroll}>
					<h1>reroll</h1>
				</button>
			</div>
			<div className="flex justify-center align-center">
				<div className="grid grid-template-columns-1 sm:grid-cols-2 md:grid-cols-3 m-auto">
					{build &&
						// yeah dont ask
						[...build.keys()].map((c: ItemCategory) =>
							build.get(c)?.map((i: Item, j: number) => {
								return <Card item={i as Item} reroll={handleRerollItem} />;
							})
						)}{" "}
				</div>
			</div>
		</div>
	);
}
