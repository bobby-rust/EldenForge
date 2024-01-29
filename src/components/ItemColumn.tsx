import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import Item from "./Item";

const SELECT_WIDTH = "80%";

const SELECT_CONTAINER_THEME: Object = {
    mb: 1,
    minWidth: SELECT_WIDTH,
    maxHeight: "10vw",
};

const SELECT_THEME: Object = {
    height: "2rem",
};

const CONTAINER_THEME = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    mt: 2,
};

export default function ItemColumn(props: any) {
    const handleDispatch = (event: SelectChangeEvent) => {
        event.preventDefault();
        props.buildNumsDispatch({
            type: event.target.name,
            payload: event.target.value,
        });
    };

    return (
        <>
            {props.itemType !== "armor" && (
                <Box sx={CONTAINER_THEME}>
                    <Box sx={SELECT_CONTAINER_THEME}>
                        <FormControl fullWidth>
                            {props.itemType !== "ashes" && (
                                <>
                                    <InputLabel
                                        id="demo-simple-select-label"
                                        sx={{
                                            fontFamily: "Cormorant Garamond",
                                            letterSpacing: "1px",
                                            color: "black",
                                        }}
                                    >
                                        {props.itemType.charAt(0).toUpperCase() +
                                            props.itemType.slice(1)}
                                    </InputLabel>
                                    <Select
                                        MenuProps={{ disableScrollLock: true }}
                                        sx={SELECT_THEME}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={props.buildNums[props.itemType]}
                                        label={props.itemType}
                                        name={props.itemType.toUpperCase()}
                                        variant="outlined"
                                        onChange={handleDispatch}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                    </Select>
                                </>
                            )}
                            {props.itemType === "ashes" && (
                                <>
                                    <InputLabel
                                        id="demo-simple-select-label"
                                        sx={{
                                            fontFamily: "Cormorant Garamond",
                                            letterSpacing: "1px",
                                            color: "black",
                                        }}
                                    >
                                        {props.itemType.charAt(0).toUpperCase() +
                                            props.itemType.slice(1) +
                                            " of War"}
                                    </InputLabel>
                                    <Select
                                        MenuProps={{ disableScrollLock: true }}
                                        sx={SELECT_THEME}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={props.buildNums[props.itemType]}
                                        label={props.itemType + " of War"}
                                        name={props.itemType.toUpperCase()}
                                        variant="outlined"
                                        onChange={handleDispatch}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                    </Select>
                                </>
                            )}
                        </FormControl>
                    </Box>

                    {props.build.map((item: any, i: number) => {
                        return (
                            <Item
                                key={i}
                                item={item}
                                itemType={props.itemType}
                                buildDispatch={props.buildDispatch}
                            />
                        );
                    })}
                    {/* <NewItem />
                    <NewItem />
                    <NewItem />
                    <NewItem /> */}
                </Box>
            )}
            {props.itemType === "armor" && (
                <Box sx={{ ...CONTAINER_THEME }}>
                    <Typography sx={{ fontFamily: "Cormorant Garamond", height: "40px" }}>
                        Armor
                    </Typography>
                    {props.build.map((item: any, i: number) => {
                        let armorType;
                        switch (i) {
                            case 0:
                                armorType = "HELM";
                                break;
                            case 1:
                                armorType = "CHEST";
                                break;
                            case 2:
                                armorType = "GAUNTLETS";
                                break;
                            case 3:
                                armorType = "LEG";
                                break;
                        }
                        return (
                            <Item
                                key={i}
                                item={item}
                                itemType={props.itemType + "." + armorType}
                                buildDispatch={props.buildDispatch}
                            />
                        );
                    })}
                </Box>
            )}
        </>
    );
}
