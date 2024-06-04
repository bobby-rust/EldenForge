// import React from "react";
// import "./App.css";
// import { generateRandomBuild, getNewItem } from "./utils/generateRandomBuild";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { IncludePreviouslyRolled, buildNumsAction, buildNumsState } from "./types/ItemTypes";
// import SmallLayout from "./components/SmallLayout";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

import React from "react";
import BuildGenerator from "./classes/BuildGenerator";
import { ItemCategory } from "./types/enums";

// const initialIncludePreviouslyRolled: IncludePreviouslyRolled = {
// 	weapons: false,
// 	ashes: false,
// 	incantations: false,
// 	shields: false,
// 	sorceries: false,
// 	spirits: false,
// 	talismans: false,
// 	tears: false,
// 	seals: false,
// };

// const initialBuild = generateRandomBuild(2, 2, 2, 2, 2, 2, 2, 2, 1, initialIncludePreviouslyRolled);
// const App = () => {
// 	const [includePreviouslyRolled, setIncludePreviouslyRolled] = React.useState({
// 		weapons: false,
// 		ashes: false,
// 		incantations: false,
// 		shields: false,
// 		sorceries: false,
// 		spirits: false,
// 		talismans: false,
// 		tears: false,
// 		seals: false,
// 	});

// 	// Build quantity reducer
// 	const quantityReducer = (state: buildNumsState, action: buildNumsAction) => {
// 		/**
// 		 * Reducer for the state of the number of each item type to generate
// 		 * This function gets called every time the user changes the values of the select menu for any item type
// 		 */

// 		const { type, payload } = action;

// 		switch (type) {
// 			case "WEAPONS":
// 				return { ...state, weapons: payload };
// 			case "ASHES":
// 				return { ...state, ashes: payload };
// 			case "INCANTATIONS":
// 				return { ...state, incantations: payload };
// 			case "SORCERIES":
// 				return { ...state, sorceries: payload };
// 			case "SPIRITS":
// 				return { ...state, spirits: payload };
// 			case "TALISMANS":
// 				return { ...state, talismans: payload };
// 			case "TEARS":
// 				return { ...state, tears: payload };
// 			case "SEALS":
// 				return { ...state, tears: payload };

// 			case "SHIELDS":
// 				return { ...state, shields: payload };
// 			default:
// 				return state;
// 		}
// 	};
// 	// End reducer

// 	// Set up build numbers state
// 	const [buildNums, buildNumsDispatch] = React.useReducer(quantityReducer, {
// 		weapons: 2,
// 		ashes: 2,
// 		incantations: 2,
// 		sorceries: 2,
// 		spirits: 2,
// 		talismans: 2,
// 		tears: 2,
// 		seals: 2,
// 		shields: 1,
// 	});
// 	// End set up build numbers state

// 	const rolledItemsString: string | null = sessionStorage.getItem("rolledItems");
// 	let rolledItems: object;
// 	if (rolledItemsString) {
// 		rolledItems = JSON.parse(rolledItemsString);
// 	} else {
// 		rolledItems = {};
// 	}

// 	// Reroll item reducer
// 	const buildReducer = (state: any, action: any) => {
// 		/**
// 		 * Reducer for the build state
// 		 * This function gets called every time the user generates a build or an individual item
// 		 * When an item is rerolled, a new build is created with all old values
// 		 * the new value is searched for using the action.id parameter, and
// 		 * the get item function for that item type is called
// 		 * @param state: the build's state object
// 		 * @param action.id: the id of the item to reroll or null if a full build is to be generated
// 		 * @param action.type: the category of item to generate if its a single item or "FULLBUILD" if a full build is to be generated
// 		 * @return a new state object
// 		 */

// 		const { id, type } = action;

// 		switch (type) {
// 			case "FULLBUILD":
// 				const newBuild = generateRandomBuild(
// 					buildNums.weapons,
// 					buildNums.ashes,
// 					buildNums.incantations,
// 					buildNums.sorceries,
// 					buildNums.spirits,
// 					buildNums.talismans,
// 					buildNums.tears,
// 					buildNums.seals,
// 					buildNums.shields,
// 					includePreviouslyRolled
// 				);

// 				return newBuild;

// 			// Armors are hard-coded to include previously rolled because that functionality is to be implemented.
// 			case "ARMOR.HELM":
// 				const newStateHelm = getNewItem(id, state, "ARMOR.HELM", true, rolledItems);
// 				return newStateHelm;

// 			case "ARMOR.CHEST":
// 				const newStateChest = getNewItem(id, state, "ARMOR.CHEST", true, rolledItems);
// 				return newStateChest;

// 			case "ARMOR.GAUNTLETS":
// 				const newStateGaunt = getNewItem(id, state, "ARMOR.GAUNTLETS", true, rolledItems);
// 				return newStateGaunt;

// 			case "ARMOR.LEG":
// 				const newStateLegs = getNewItem(id, state, "ARMOR.LEG", true, rolledItems);
// 				return newStateLegs;

// 			case "WEAPONS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateWep = getNewItem(id, state, "WEAPONS", includePreviouslyRolled.weapons, rolledItems);
// 				return newStateWep;

// 			case "ASHES":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateAsh = getNewItem(id, state, "ASHES", includePreviouslyRolled.ashes, rolledItems);
// 				return newStateAsh;

// 			case "INCANTATIONS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateInc = getNewItem(id, state, "INCANTATIONS", includePreviouslyRolled.incantations, rolledItems);
// 				return newStateInc;

// 			case "SORCERIES":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateSorc = getNewItem(id, state, "SORCERIES", includePreviouslyRolled.sorceries, rolledItems);
// 				return newStateSorc;

// 			case "SPIRITS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateSpirits = getNewItem(id, state, "SPIRITS", includePreviouslyRolled.spirits, rolledItems);
// 				return newStateSpirits;

// 			case "TALISMANS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateTalismans = getNewItem(id, state, "TALISMANS", includePreviouslyRolled.talismans, rolledItems);
// 				return newStateTalismans;

// 			case "TEARS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateTears = getNewItem(id, state, "TEARS", includePreviouslyRolled.tears, rolledItems);
// 				return newStateTears;

// 			case "SEALS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateSeals = getNewItem(id, state, "SEALS", includePreviouslyRolled.seals, rolledItems);
// 				return newStateSeals;

// 			case "SHIELDS":
// 				if (!id) {
// 					console.log("Please provide an id.");
// 				}
// 				const newStateShield = getNewItem(id, state, "SHIELDS", includePreviouslyRolled.shields, rolledItems);
// 				return newStateShield;

// 			default:
// 				console.log("No changes were made.");
// 				return state;
// 		}
// 	};
// 	// End reducer

// 	const [build, buildDispatch] = React.useReducer(buildReducer, initialBuild);

// 	React.useEffect(() => {
// 		const setupSessionStorageData = {
// 			weapons: [],
// 			armor: [],
// 			ashes: [],
// 			incantations: [],
// 			shields: [],
// 			sorceries: [],
// 			spirits: [],
// 			talismans: [],
// 			tears: [],
// 			// seals: [],
// 		};
// 		// Set the initial include previously rolled state
// 		setIncludePreviouslyRolled(initialIncludePreviouslyRolled);

// 		// Set the initial session storage.
// 		sessionStorage.setItem("rolledItems", JSON.stringify(setupSessionStorageData));
// 	}, []);

// 	return (
// 		<div className="App">
// 			<>
// 				<Header />
// 				<SmallLayout
// 					buildDispatch={buildDispatch}
// 					buildNums={buildNums}
// 					buildNumsDispatch={buildNumsDispatch}
// 					includePreviouslyRolled={includePreviouslyRolled}
// 					setIncludePreviouslyRolled={setIncludePreviouslyRolled}
// 					build={build}
// 				/>
// 				<Footer />
// 			</>
// 		</div>
// 	);
// };

// export default App;

const App = () => {
	const generator = new BuildGenerator();
	const url = generator.generateUrl();
	console.log("initialUrl: ", atob(url));
	const build = generator.generateBuildFromUrl(url);

	console.log("old item: ", build._items.get(ItemCategory.Weapons)![0]);
	build.replaceItem(
		ItemCategory.Weapons,
		build._items.get(ItemCategory.Weapons)![0],
		generator.generateItem(ItemCategory.Weapons)
	);

	console.log("new item: ", build._items.get(ItemCategory.Weapons)![0]);
	const newUrl = generator.createUrlFromBuildMap(build._items);

	console.log("newUrl: ", atob(newUrl));

	return <div className="App"></div>;
};

export default App;
