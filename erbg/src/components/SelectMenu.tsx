import React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const SELECT_WIDTH: number = 130

export default function SelectMenu(props: any) {
    const handleDispatch = (event: SelectChangeEvent) => {
        event.preventDefault()
        props.buildNumsDispatch({type: event.target.name, payload: event.target.value})
    }

    /**
     * Need to pass buildNums and the dispatch func.
     */
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
                        value={props.buildNums.weapons}
                        label='Weapons'
                        name='WEAPONS'
                        onChange={handleDispatch}
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
                        value={props.buildNums.ashes}
                        label='Ashes'
                        name='ASHES'
                        onChange={handleDispatch}
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
                        value={props.buildNums.spirits}
                        label='Spirits'
                        name='SPIRITS'
                        onChange={handleDispatch}
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
                        value={props.buildNums.talis}
                        label='Talismans'
                        name='TALIS'
                        onChange={handleDispatch}
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
                        value={props.buildNums.sorcs}
                        label='Sorceries'
                        name='SORCS'
                        onChange={handleDispatch}
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
                        value={props.buildNums.incants}
                        label='Incantations'
                        name='INCANTS'
                        onChange={handleDispatch}
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
