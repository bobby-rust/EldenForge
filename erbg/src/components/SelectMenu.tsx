import React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const SELECT_WIDTH: number = 130

export default function SelectMenu(props: any) {
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "WEAPONS", num: event.target.value})}
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "ASHES", num: event.target.value})}
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "SPIRITS", num: event.target.value})}
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "TALIS", num: event.target.value})}
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "SORCS", num: event.target.value})}
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
                        onChange={(event: SelectChangeEvent) => props.buildNumsDispatch({type: "INCANTS", num: event.target.value})}
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
