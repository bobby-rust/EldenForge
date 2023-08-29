import React from "react";
import "./App.css";
import "./styles/header.css";
import { generateRandomBuild, getNewItem } from "./functions/generateRandomBuild";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import SmallLayout from "./layouts/SmallLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { IncludePreviouslyRolled, buildNumsAction, buildNumsState } from "./types/ItemTypes";
import ResponsiveAppBar from "./components/AppBar";

const initialIncludePreviouslyRolled: IncludePreviouslyRolled = {
    weapons: false,
    ashes: false,
    incantations: false,
    shields: false,
    sorceries: false,
    spirits: false,
    talismans: false,
};

const initialBuild = generateRandomBuild(2, 2, 2, 2, 2, 2, 1, initialIncludePreviouslyRolled);

const App = () => {
    // An object with a boolean value for each item category
    const [includePreviouslyRolled, setIncludePreviouslyRolled] = React.useState({
        weapons: false,
        ashes: false,
        incantations: false,
        shields: false,
        sorceries: false,
        spirits: false,
        talismans: false,
    });

    // Build quantity reducer
    const quantityReducer = (state: buildNumsState, action: buildNumsAction) => {
        /**
         * Reducer for the state of the number of each item type to generate
         * This function gets called every time the user changes the values of the select menu for any item type
         */

        const { type, payload } = action;

        switch (type) {
            case "WEAPONS":
                return { ...state, weapons: payload };
            case "ASHES":
                return { ...state, ashes: payload };
            case "INCANTS":
                return { ...state, incants: payload };
            case "SORCS":
                return { ...state, sorcs: payload };
            case "SPIRITS":
                return { ...state, spirits: payload };
            case "TALIS":
                return { ...state, talis: payload };
            case "SHIELDS":
                return { ...state, shields: payload };
            default:
                return state;
        }
    };
    // End reducer

    // Set up build numbers state
    const [buildNums, buildNumsDispatch] = React.useReducer(quantityReducer, {
        weapons: 2,
        ashes: 2,
        incants: 2,
        sorcs: 2,
        spirits: 2,
        talis: 2,
        shields: 1,
    });
    // End set up build numbers state

    const rolledItemsString: string | null = sessionStorage.getItem("rolledItems");
    let rolledItems: object;
    if (rolledItemsString) {
        rolledItems = JSON.parse(rolledItemsString);
    } else {
        rolledItems = {};
    }

    // function generateNewBuild() {
    //     buildDispatch({ type: "FULLBUILD" });
    // }

    // Reroll item reducer
    const buildReducer = (state: any, action: any) => {
        /**
         * Reducer for the build state
         * This function gets called every time the user generates a build or an individual item
         * When an item is rerolled, a new build is created with all old values
         * the new value is searched for using the action.id parameter, and
         * the get item function for that item type is called
         * @param state: the build's state object
         * @param action.id: the id of the item to reroll or null if a full build is to be generated
         * @param action.type: the category of item to generate if its a single item or "FULLBUILD" if a full build is to be generated
         * @return a new state object
         */

        const { id, type } = action;

        switch (type) {
            case "FULLBUILD":
                const newBuild = generateRandomBuild(
                    buildNums.weapons,
                    buildNums.ashes,
                    buildNums.incants,
                    buildNums.sorcs,
                    buildNums.spirits,
                    buildNums.talis,
                    buildNums.shields,
                    includePreviouslyRolled
                );

                return newBuild;

            // Armors are hard-coded to include previously rolled because that functionality is to be implemented.
            case "ARMOR.HELM":
                const newStateHelm = getNewItem(id, state, "ARMOR.HELM", true, rolledItems);
                return newStateHelm;
            case "ARMOR.CHEST":
                const newStateChest = getNewItem(id, state, "ARMOR.CHEST", true, rolledItems);
                return newStateChest;
            case "ARMOR.GAUNTLETS":
                const newStateGaunt = getNewItem(id, state, "ARMOR.GAUNTLETS", true, rolledItems);
                return newStateGaunt;
            case "ARMOR.LEG":
                const newStateLegs = getNewItem(id, state, "ARMOR.LEG", true, rolledItems);
                return newStateLegs;
            case "WEAPONS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateWep = getNewItem(
                    id,
                    state,
                    "WEAPONS",
                    includePreviouslyRolled.weapons,
                    rolledItems
                );
                return newStateWep;
            case "ASHES":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateAsh = getNewItem(
                    id,
                    state,
                    "ASHES",
                    includePreviouslyRolled.ashes,
                    rolledItems
                );
                return newStateAsh;
            case "INCANTS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateInc = getNewItem(
                    id,
                    state,
                    "INCANTS",
                    includePreviouslyRolled.incantations,
                    rolledItems
                );
                return newStateInc;
            case "SORCS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateSorc = getNewItem(
                    id,
                    state,
                    "SORCS",
                    includePreviouslyRolled.sorceries,
                    rolledItems
                );
                return newStateSorc;
            case "SPIRITS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateSpirits = getNewItem(
                    id,
                    state,
                    "SPIRITS",
                    includePreviouslyRolled.spirits,
                    rolledItems
                );
                return newStateSpirits;
            case "TALIS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateTalis = getNewItem(
                    id,
                    state,
                    "TALIS",
                    includePreviouslyRolled.talismans,
                    rolledItems
                );
                return newStateTalis;

            case "SHIELDS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateShield = getNewItem(
                    id,
                    state,
                    "SHIELDS",
                    includePreviouslyRolled.shields,
                    rolledItems
                );
                return newStateShield;
            default:
                console.log("No changes were made.");
                return state;
        }
    };
    // End reducer

    const [build, buildDispatch] = React.useReducer(buildReducer, initialBuild);

    React.useEffect(() => {
        const setupSessionStorageData = {
            weapons: [],
            armor: [],
            ashes: [],
            incantations: [],
            shields: [],
            sorceries: [],
            spirits: [],
            talismans: [],
        };

        // Set the initial include previously rolled state
        setIncludePreviouslyRolled({
            weapons: false,
            ashes: false,
            incantations: false,
            shields: false,
            sorceries: false,
            spirits: false,
            talismans: false,
        });

        // Set the initial session storage.
        sessionStorage.setItem("rolledItems", JSON.stringify(setupSessionStorageData));

        // Generate (and set) the initial build.
        buildDispatch({ type: "FULLBUILD" });
    }, []);

    // Set up media state
    const [mediaState, setMediaState] = React.useState({
        isLargeMedia: window.matchMedia("(min-width: 1200px)").matches,
    });
    const handler = (event: any) => setMediaState({ isLargeMedia: event.matches });
    window.matchMedia("(min-width: 1200px)").addEventListener("change", handler);
    // End set up media state

    // Set up layout state
    const [layout, setLayout] = React.useState({
        isLargeLayout: true,
        size: "",
    });
    // End set up layout state

    // Set up color button state
    const [colorButtonState, setColorButtonState] = React.useState(true);
    // End set up color button state

    // Set up layout button state
    const [layoutButtonState, setLayoutButtonState] = React.useState(true);
    // End set up layout button state

    // color Styling State
    const [darkMode, setDarkMode] = React.useState({
        isDarkMode: true,
        color: "",
    });
    // End color Styling State

    // Handle color change
    function handleColorChange() {
        setColorButtonState(!colorButtonState);

        if (darkMode.isDarkMode) {
            setDarkMode({ isDarkMode: false, color: "-lt" });
        } else if (!darkMode.isDarkMode) {
            setDarkMode({ isDarkMode: true, color: "" });
        }
    }
    // End handle color change

    // Handle layout change
    function handleLayoutChange() {
        setLayoutButtonState(!layoutButtonState);
        if (layout.isLargeLayout) {
            setLayout({ isLargeLayout: false, size: "-sm" });
        } else if (!layout.isLargeLayout) {
            setLayout({ isLargeLayout: true, size: "" });
        }
    }
    // End handle layout change

    // Handle mobile user
    if (!mediaState.isLargeMedia) {
        return <div className="mobile-message">Mobile support coming soon.</div>;
    }
    // End handle mobile user

    return (
        <div className="App">
            <>
                {/* <Header
                    color={darkMode.color}
                    handleColorChange={handleColorChange}
                    handleLayoutChange={handleLayoutChange}
                    layoutButtonState={layoutButtonState}
                    colorButtonState={colorButtonState}
                /> */}
                <ResponsiveAppBar
                    includePreviouslyRolled={includePreviouslyRolled}
                    setIncludePreviouslyRolled={setIncludePreviouslyRolled}
                />

                {/* {layout.isLargeLayout && (
                <LargeLayout
                    color={darkMode.color}
                    build={build}
                    handleColorChange={handleColorChange}
                    handleLayoutChange={handleLayoutChange}
                    generateNewBuild={generateNewBuild}
                    size={layout.size}
                />
            )}

            {!layout.isLargeLayout && (
                <SmallLayout
                    color={darkMode.color}
                    build={build}
                    handleColorChange={handleColorChange}
                    handleLayoutChange={handleLayoutChange}
                    generateNewBuild={generateNewBuild}
                    size={layout.size}
                />
            )} */}
                <div className="App-sm">
                    <SmallLayout
                        color={darkMode.color}
                        handleColorChange={handleColorChange}
                        handleLayoutChange={handleLayoutChange}
                        size={layout.size}
                        buildDispatch={buildDispatch}
                        buildNums={buildNums}
                        buildNumsDispatch={buildNumsDispatch}
                        includePreviouslyRolled={includePreviouslyRolled}
                        setIncludePreviouslyRolled={setIncludePreviouslyRolled}
                        build={build}
                        // initialBuild={initialBuild}
                    />
                </div>
                {/* <DevMessage /> */}
                <AnalyticsWrapper />
            </>
        </div>
    );
};

export default App;
