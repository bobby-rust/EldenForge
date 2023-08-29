import {
    Box,
    InputLabel,
    Select,
    OutlinedInput,
    Typography,
    MenuItem,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { RolledItems } from "../types/ItemTypes";

type IncludeCategories = {
    // armors: boolean;
    ashes: boolean;
    incantations: boolean;
    shields: boolean;
    sorceries: boolean;
    spirits: boolean;
    talismans: boolean;
    weapons: boolean;
    [key: string]: boolean;
};

export default function IncludePreviouslyRolledMenu(props: any) {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
                fontSize: "1px",
            },
        },
    };

    // This is what is shown in the select menu next to checkboxes
    const categories: string[] = [
        "Weapons",
        // "Armor",
        "Ashes",
        "Incantations",
        "Sorceries",
        "Spirits",
        "Talismans",
        "Shields",
    ];

    let categoriesToIncludePreviouslyRolled: IncludeCategories = {
        // armors: false,
        ashes: false,
        incantations: false,
        shields: false,
        sorceries: false,
        spirits: false,
        talismans: false,
        weapons: false,
    };

    const [category, setCategory] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof category>) => {
        const {
            target: { value },
        } = event;

        setCategory(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    React.useEffect(() => {
        for (let i = 0; i < category.length; i++) {
            const currCat: string = category[i].toLowerCase();
            categoriesToIncludePreviouslyRolled[currCat] =
                !categoriesToIncludePreviouslyRolled[currCat];
        }

        const rolledItemsString: string | null = sessionStorage.getItem("rolledItems");
        let rolledItems: RolledItems;
        if (rolledItemsString) {
            rolledItems = JSON.parse(rolledItemsString);
        } else {
            rolledItems = {
                weapons: [],
                // armor: [],
                ashes: [],
                incants: [],
                shields: [],
                sorcs: [],
                spirits: [],
                talis: [],
                starting_class: "",
            };
        }
        const keys = Object.keys(categoriesToIncludePreviouslyRolled);

        for (let i = 0; i < keys.length; ++i) {
            const key: string = keys[i];

            if (categoriesToIncludePreviouslyRolled[key]) {
                rolledItems[key] = [];
            }
        }

        sessionStorage.setItem("rolledItems", JSON.stringify(rolledItems));
        props.setIncludePreviouslyRolled(categoriesToIncludePreviouslyRolled);
    }, [category]);
    return (
        <div>
            <Typography
                variant="caption"
                sx={{
                    width: 150,
                    textAlign: "center",
                    display: "flex",
                    position: "absolute",
                    transform: "translate(5px, -10px)",
                    fontSize: "10px",
                    zIndex: 100,
                }}
            >
                Include previously rolled
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 1,
                }}
            >
                {/* <InputLabel id="demo-multiple-checkbox-label">include previously rolled</InputLabel> */}
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    displayEmpty
                    sx={{ ...props.selectTheme, width: 100 }}
                    variant="outlined"
                    value={category}
                    onChange={handleChange}
                    input={<OutlinedInput label="" />}
                    renderValue={(selected) =>
                        category.length >= 1 ? (
                            selected.join(", ")
                        ) : (
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: "10px",
                                }}
                            >
                                Select categories
                            </Typography>
                        )
                    }
                    MenuProps={MenuProps}
                    // sx={{
                    //     width: "100",
                    //     height: "2rem",
                    //     // maxWidth: "10em",
                    //     maxWidth: 100,
                    //     overflow: "hidden",
                    // }}
                >
                    {categories.map((cat: string) => (
                        <MenuItem key={cat} value={cat}>
                            <Checkbox checked={category.indexOf(cat) > -1} />
                            <ListItemText primary={cat} />
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </div>
    );
}
