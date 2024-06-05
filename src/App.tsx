import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Build from "./components/Build";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

import React from "react";
import BuildGenerator from "./classes/BuildGenerator";
import { ItemCategory } from "./types/enums";
import useGeneratorState from "./hooks/useGeneratorState";
import { defaultBuildGenerationConfig } from "./types/types";

const App = () => {
	const generator = new BuildGenerator();
	const [url, setUrl] = React.useState(generator.generateUrl());

	const { generatorState, setBuildNumsForCategory, setExcludePreviouslyRolledForCategory } = useGeneratorState(
		defaultBuildGenerationConfig,
		generator
	);

	const handleIncrementBuildNumsForCategory = (c: ItemCategory) => {
		setBuildNumsForCategory(c, generatorState[c].buildNums + 1);
	};

	const handleToggleExcludePreviouslyRolledForCategory = (c: ItemCategory) => {
		setExcludePreviouslyRolledForCategory(c, !generatorState[c].excludePreviouslyRolled);
	};

	const handleReroll = () => {
		setUrl(generator.generateUrl());
	};

	React.useEffect(() => {
		console.log(generator._buildGenerationConfig.weapons.buildNums);
	}, [generatorState.weapons.buildNums]);

	React.useEffect(() => {
		console.log(generator._buildGenerationConfig.weapons.excludePreviouslyRolled);
	}, [generator._buildGenerationConfig.weapons.excludePreviouslyRolled]);

	return (
		<div className="App">
			{/* <>
				<Header />
				<Build />
				<Footer />
			</> */}

			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Weapons)}>increment num weapons</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Ashes)}>increment num ashes</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Incants)}>increment num incants</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Seals)}>increment num seals</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Sorcs)}>increment num sorcs</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Shields)}>increment num shields</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Spirits)}>increment num spirits</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Talismans)}>increment num talis</button>
			<button onClick={() => handleIncrementBuildNumsForCategory(ItemCategory.Tears)}>increment num tear</button>
			<button onClick={handleReroll}>reroll</button>
			<button onClick={() => handleToggleExcludePreviouslyRolledForCategory(ItemCategory.Weapons)}>num weapons</button>
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
			<h5>{atob(url)}</h5>
		</div>
	);
};

export default App;

// const App = () => {
// 	const generator = new BuildGenerator();
// 	const url = generator.generateUrl();
// 	console.log("initialUrl: ", atob(url));
// 	const build = generator.generateBuildFromUrl(url);

// 	console.log("old item: ", build._items.get(ItemCategory.Weapons)![0]);
// 	build.replaceItem(
// 		ItemCategory.Weapons,
// 		build._items.get(ItemCategory.Weapons)![0],
// 		generator.generateItem(ItemCategory.Weapons)
// 	);

// 	console.log("new item: ", build._items.get(ItemCategory.Weapons)![0]);
// 	const newUrl = generator.createUrlFromBuildMap(build._items);

// 	console.log("newUrl: ", atob(newUrl));

// 	return <div className="App"></div>;
// };

// export default App;
