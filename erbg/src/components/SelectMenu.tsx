import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const SELECT_WIDTH: number = 130;

const BOX_THEME: Object = {
    mx: 1,
    minWidth: SELECT_WIDTH,
    maxHeight: "10vw",
};

const SELECT_THEME: Object = {
    height: "2rem",
};

const selectVariant = "standard";

export default function SelectMenu(props: any) {
    const handleDispatch = (event: SelectChangeEvent) => {
        event.preventDefault();
        props.buildNumsDispatch({
            type: event.target.name,
            payload: event.target.value,
        });
    };

    /**
     * Need to pass buildNums and the dispatch func.
     */
    return (
        <>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Weapons
                    </InputLabel>
                    <Select
                        MenuProps={{ disableScrollLock: true }}
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.weapons}
                        label='Weapons'
                        name='WEAPONS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Sorceries
                    </InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.sorcs}
                        label='Sorceries'
                        name='SORCS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Incantations
                    </InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.incants}
                        label='Incantations'
                        name='INCANTS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>Ashes</InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.ashes}
                        label='Ashes'
                        variant={selectVariant}
                        name='ASHES'
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Talismans
                    </InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.talis}
                        label='Talismans'
                        name='TALIS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Spirits
                    </InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.spirits}
                        label='Spirits'
                        name='SPIRITS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={BOX_THEME}>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Shields
                    </InputLabel>
                    <Select
                        sx={SELECT_THEME}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.buildNums.shields}
                        label='Shields'
                        name='SHIELDS'
                        variant={selectVariant}
                        onChange={handleDispatch}>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
}
