import React, { memo } from "react";
import "./App.css";
import "./styles/header.css";
import { generateRandomBuild, getNewItem } from "./functions/generateRandomBuild";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import SmallLayout from "./layouts/SmallLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { buildNumsAction, buildNumsState } from "./types/ItemTypes";
import ResponsiveAppBar from "./components/AppBar";

const initialData = {
    weapons: [],
    armors: [],
    ashes: [],
    incantations: [],
    shields: [],
    sorceries: [],
    spirits: [],
    talismans: [],
};
sessionStorage.setItem("rolledItems", JSON.stringify(initialData));

const initialBuild = generateRandomBuild(2, 2, 2, 2, 2, 2, 1, {
    armors: false,
    ashes: false,
    incantations: false,
    shields: false,
    sorceries: false,
    spirits: false,
    talismans: false,
    weapons: false,
});

const App = () => {
    console.log("calling app.tsx");

    // An object with a boolean value for each item category
    const [includePreviouslyRolled, setIncludePreviouslyRolled] = React.useState({
        armors: false,
        ashes: false,
        incantations: false,
        shields: false,
        sorceries: false,
        spirits: false,
        talismans: false,
        weapons: false,
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

    /**
     * Generate new build
     * Pass the state of buildNums; this is the function called when the user generates a new build
     */

    // End generate new build

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

    // React.useEffect(() => {
    // }, []);

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
                        buildNums={buildNums}
                        buildNumsDispatch={buildNumsDispatch}
                        includePreviouslyRolled={includePreviouslyRolled}
                        setIncludePreviouslyRolled={setIncludePreviouslyRolled}
                        initialBuild={initialBuild}
                    />
                </div>
                {/* <DevMessage /> */}
                <AnalyticsWrapper />
            </>
        </div>
    );
};

export default App;
