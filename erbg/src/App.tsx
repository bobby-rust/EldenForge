import React from 'react'
import './App.css'
import './styles/header.css'
import generateRandomBuild from './functions/generateRandomBuild'
import AnalyticsWrapper from './components/AnalyticsWrapper'
import SmallLayout from './layouts/SmallLayout'
import DevMessage from './components/DevMessage'
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
// import {reducer} from './functions/reducer'

function App() {
    const initialBuild = { 
        weapons: 2,
        ashes: 1,
        incants: 2,
        sorcs: 2,
        spirits: 1,
        talis: 2,
        shields: 1,
    }

    // Set up items state
    const [build, setBuild] = React.useState(generateRandomBuild(initialBuild.weapons, initialBuild.ashes, initialBuild.incants, initialBuild.sorcs, initialBuild.spirits, initialBuild.talis))
    // End set up items state

    
    // const [numWeapons, setNumWeapons] = React.useState('')
    // const [numAshes, setNumAshes] = React.useState('')
    // const [numSpirits, setNumSpirits] = React.useState('')
    // const [numTalis, setNumTalis] = React.useState('')
    // const [numSorcs, setNumSorcs] = React.useState('')
    // const [numIncants, setNumIncants] = React.useState('')
    // const [numShields, setNumShields] = React.useState('')
    
    // Generate new build
    function generateNewBuild() {
        console.log("Setting new build with: \nWeapons: ", buildNums.weapons)
        setBuild(generateRandomBuild(buildNums.weapons, buildNums.ashes, buildNums.incants, buildNums.sorcs, buildNums.spirits, buildNums.talis))
    }
    // End generate new build
    
    const reducer = (state: any, action: any) => {
        switch(action.type) {
            case "WEAPONS":
                return {...state, weapons: action.num}
            case "ASHES": 
                return {...state, ashes: action.num}
            case "INCANTS":
                return {...state, incants: action.num}
            case "SORCS":
                return {...state, sorcs: action.num}
            case "SPIRITS":
                return {...state, spirits: action.num}
            case "TALIS": 
                return {...state, talis: action.num}
            case "SHIELDS":
                return {...state, shields: action.num}
            default:
                return state;
        }
    }

    const [buildNums, buildNumsDispatch] = React.useReducer(reducer, initialBuild);

    // const handleComplete = (todo) => {
    //   dispatch({ type: "COMPLETE", id: todo.id });
    // };

    // const handleChangeNumWeapons = (event: SelectChangeEvent) => {
    //     // setNumWeapons(event.target.value as string)
    //     dispatch({ type: "WEAPONS", num: event.target.value})
    //     console.log('Number of weapons selected: ', buildNums.weapons)
    // }
    // const handleChangeNumAshes = (event: SelectChangeEvent) => {
    //     // setNumAshes(event.target.value as string)
    //     dispatch({ type: "ASHES", num: event.target.value})
    //     console.log('Number of ashes selected: ', buildNums.ashes)
    // }
    // const handleChangeNumSpirits = (event: SelectChangeEvent) => {
    //     // setNumSpirits(event.target.value as string)
    //     dispatch({ type: "SPIRITS", num: event.target.value})
    //     console.log('Number of spirits selected: ', buildNums.spirits)
    // }
    // const handleChangeNumTalis = (event: SelectChangeEvent) => {
    //     // setNumTalis(event.target.value as string)
    //     dispatch({ type: "TALIS", num: event.target.value})
    //     console.log('Number of talismans selected: ', buildNums.talis)
    // }
    // const handleChangeNumSorcs = (event: SelectChangeEvent) => {
    //     // setNumSorcs(event.target.value as string)
    //     dispatch({ type: "SORCS", num: event.target.value})
    //     console.log('Number of sorceries selected: ', buildNums.sorcs)
    // }
    // const handleChangeNumIncants = (event: SelectChangeEvent) => {
    //     // setNumIncants(event.target.value as string)
    //     dispatch({ type: "INCANTS", num: event.target.value})
    //     console.log('Number of incants selected: ', buildNums.incants)
    // }
    // const handleChangeNumShields = (event: SelectChangeEvent) => {
    //     setNumShields(event.target.value as string)
    //     console.log('Number of shields selected: ', numShields)
    // }


    // Set up media state
    const [mediaState, setMediaState] = React.useState({
        isLargeMedia: window.matchMedia('(min-width: 1200px)').matches,
    })
    const handler = (e: any) => setMediaState({ isLargeMedia: e.matches })
    window.matchMedia('(min-width: 1200px)').addEventListener('change', handler)
    // End set up media state

    // Set up layout state
    const [layout, setLayout] = React.useState({
        isLargeLayout: true,
        size: '',
    })
    // End set up layout state

    // Set up color button state
    const [colorButtonState, setColorButtonState] = React.useState(true)
    // End set up color button state

    // Set up layout button state
    const [layoutButtonState, setLayoutButtonState] = React.useState(true)
    // End set up layout button state

    // color Styling State
    const [darkMode, setDarkMode] = React.useState({
        isDarkMode: true,
        color: '',
    })
    // End color Styling State

    // Handle color change
    function handleColorChange() {
        setColorButtonState(!colorButtonState)

        if (darkMode.isDarkMode) {
            setDarkMode({ isDarkMode: false, color: '-lt' })
        } else if (!darkMode.isDarkMode) {
            setDarkMode({ isDarkMode: true, color: '' })
        }
    }
    // End handle color change

    // Handle layout change
    function handleLayoutChange() {
        setLayoutButtonState(!layoutButtonState)
        if (layout.isLargeLayout) {
            setLayout({ isLargeLayout: false, size: '-sm' })
        } else if (!layout.isLargeLayout) {
            setLayout({ isLargeLayout: true, size: '' })
        }
    }
    // End handle layout change

    // Handle mobile user
    if (!mediaState.isLargeMedia) {
        return <div className='mobile-message'>Mobile support coming soon.</div>
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
                    />
                    <DevMessage />
                </div>
                <AnalyticsWrapper />
            </>
        </div>
    )
}

export default App
