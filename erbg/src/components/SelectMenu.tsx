import React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const SELECT_WIDTH: number = 130

export default function SelectMenu() {
    const [numWeapons, setNumWeapons] = React.useState('')
    const [numAshes, setNumAshes] = React.useState('')
    const [numSpirits, setNumSpirits] = React.useState('')
    const [numTalis, setNumTalis] = React.useState('')
    const [numSorcs, setNumSorcs] = React.useState('')
    const [numIncants, setNumIncants] = React.useState('')
    const [numShields, setNumShields] = React.useState('')

    const handleChangeNumWeapons = (event: SelectChangeEvent) => {
        setNumWeapons(event.target.value as string)
        console.log('Number of weapons selected: ', numWeapons)
    }
    const handleChangeNumAshes = (event: SelectChangeEvent) => {
        setNumAshes(event.target.value as string)
        console.log('Number of ashes selected: ', numAshes)
    }
    const handleChangeNumSpirits = (event: SelectChangeEvent) => {
        setNumSpirits(event.target.value as string)
        console.log('Number of spirits selected: ', numSpirits)
    }
    const handleChangeNumTalis = (event: SelectChangeEvent) => {
        setNumTalis(event.target.value as string)
        console.log('Number of talismans selected: ', numTalis)
    }
    const handleChangeNumSorcs = (event: SelectChangeEvent) => {
        setNumSorcs(event.target.value as string)
        console.log('Number of sorceries selected: ', numSorcs)
    }
    const handleChangeNumIncants = (event: SelectChangeEvent) => {
        setNumIncants(event.target.value as string)
        console.log('Number of incants selected: ', numIncants)
    }
    const handleChangeNumShields = (event: SelectChangeEvent) => {
        setNumShields(event.target.value as string)
        console.log('Number of shields selected: ', numShields)
    }

    return (
        <>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Weapons
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numWeapons}
                        label='Weapons'
                        onChange={handleChangeNumWeapons}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>Ashes</InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numAshes}
                        label='Ashes'
                        onChange={handleChangeNumAshes}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Spirits
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numSpirits}
                        label='Spirits'
                        onChange={handleChangeNumSpirits}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Talismans
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numTalis}
                        label='Talismans'
                        onChange={handleChangeNumTalis}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Sorceries
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numSorcs}
                        label='Sorceries'
                        onChange={handleChangeNumSorcs}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Incantations
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numSorcs}
                        label='Incantations'
                        onChange={handleChangeNumIncants}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {/* <Box sx={{ minWidth: SELECT_WIDTH }}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Shields
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={numShields}
                        label='Shields'
                        onChange={handleChangeNumShields}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box> */}
        </>
    )
}
