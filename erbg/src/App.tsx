import React, { memo } from "react";
import "./App.css";
import "./styles/header.css";
import {
    generateRandomBuild,
    getNewItem,
} from "./functions/generateRandomBuild";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import SmallLayout from "./layouts/SmallLayout";
import DevMessage from "./components/DevMessage";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { buildNumsAction, buildNumsState } from "./types/ItemTypes";

const App = memo(() => {
    /**
     * This object sets the number of each item to generate by default
     * To change the number of each item generated by default, simply change the values in this object
     */
    const initialBuildNums: buildNumsState = {
        weapons: 2,
        ashes: 2,
        incants: 2,
        sorcs: 2,
        spirits: 2,
        talis: 2,
        shields: 1,
    };

    // Build quantity reducer
    const quantityReducer = (
        state: buildNumsState,
        action: buildNumsAction
    ) => {
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
    const [buildNums, buildNumsDispatch] = React.useReducer(
        quantityReducer,
        initialBuildNums
    );
    // End set up build numbers state

    // Reroll item reducer
    const buildReducer = (state: any, action: any) => {
        /**
         * Reducer for the build state
         * This function gets called every time the user generates a build or an individual item
         * When an item is rerolled, a new build is created with all old values
         * the new value is searched for using the action.id parameter, and
         * the get item function for that item type is called, with an argument of 1 if necessary
         * @param state: the build's state object
         * @param action.id: the id of the item to reroll or null if a full build is to be generated
         * @param action.build: the build object
         * @param action.type: the category of item to generate if its a single item or "FULLBUILD" if a full build is to be generated
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
                    buildNums.shields
                );
                return newBuild;
            case "WEAPONS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateWep = getNewItem(id, state, "WEAPONS");
                return newStateWep;
            case "ASHES":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateAsh = getNewItem(id, state, "ASHES");
                return newStateAsh;
            case "INCANTS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateInc = getNewItem(id, state, "INCANTS");
                return newStateInc;
            case "SORCS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateSorc = getNewItem(id, state, "SORCS");
                return newStateSorc;
            case "SPIRITS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateSpirits = getNewItem(id, state, "SPIRITS");
                return newStateSpirits;
            case "TALIS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateTalis = getNewItem(id, state, "TALIS");
                return newStateTalis;

            case "SHIELDS":
                if (!id) {
                    console.log("Please provide an id.");
                }
                const newStateShield = getNewItem(id, state, "SHIELDS");
                return newStateShield;
            default:
                console.log("No changes were made.");
                return state;
        }
    };
    // End reducer

    const initialBuild = generateRandomBuild(
        initialBuildNums.weapons,
        initialBuildNums.ashes,
        initialBuildNums.incants,
        initialBuildNums.sorcs,
        initialBuildNums.spirits,
        initialBuildNums.talis,
        initialBuildNums.shields
    );

    const [build, buildDispatch] = React.useReducer(buildReducer, initialBuild);
    /**
     * Generate new build
     * Pass the state of buildNums; this is the function called when the user generates a new build
     */
    function generateNewBuild() {
        buildDispatch({ type: "FULLBUILD" });
    }
    // End generate new build

    // Set up media state
    const [mediaState, setMediaState] = React.useState({
        isLargeMedia: window.matchMedia("(min-width: 1200px)").matches,
    });
    const handler = (event: any) =>
        setMediaState({ isLargeMedia: event.matches });
    window
        .matchMedia("(min-width: 1200px)")
        .addEventListener("change", handler);
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
        return (
            <div className='mobile-message'>Mobile support coming soon.</div>
        );
    }
    // End handle mobile user

    return (
        <div className='App'>
            <>
                <Header
                    color={darkMode.color}
                    handleColorChange={handleColorChange}
                    handleLayoutChange={handleLayoutChange}
                    layoutButtonState={layoutButtonState}
                    colorButtonState={colorButtonState}
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
                <div className='App-sm'>
                    <SmallLayout
                        color={darkMode.color}
                        build={build}
                        handleColorChange={handleColorChange}
                        handleLayoutChange={handleLayoutChange}
                        generateNewBuild={generateNewBuild}
                        size={layout.size}
                        buildNums={buildNums}
                        buildNumsDispatch={buildNumsDispatch}
                        buildDispatch={buildDispatch}
                    />
                    <DevMessage />
                </div>
                <AnalyticsWrapper />
            </>
        </div>
    );
});

export default App;
