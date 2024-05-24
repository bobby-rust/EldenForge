import {
    Box,
    Select,
    OutlinedInput,
    Typography,
    MenuItem,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
    Tooltip,
    IconButton,
} from "@mui/material";
import React from "react";
import { RolledItems } from "../types/ItemTypes";
import HelpIcon from "@mui/icons-material/Help";

type IncludeCategories = {
    ashes: boolean;
    incantations: boolean;
    shields: boolean;
    sorceries: boolean;
    spirits: boolean;
    talismans: boolean;
    weapons: boolean;
    [key: string]: boolean;
};

const TOOLTIP_BUTTON_THEME = { width: "30px", height: "30px", borderRadius: "50%", ml: 0.5 };
const tooltipText =
    "The checked categories will allow items of that category to be rolled more than once. To reset rolled items, check and uncheck the box or refresh the page.";

export default function IncludePreviouslyRolledMenu(props: any) {
    // This is what is shown in the select menu next to checkboxes
    const categories: string[] = [
        "Weapons",
        "Ashes",
        "Incantations",
        "Sorceries",
        "Spirits",
        "Talismans",
        "Shields",
    ];

    let categoriesToIncludePreviouslyRolled: IncludeCategories = {
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
        // console.log("getting previous session storage data");
        const rolledItemsString: string | null = sessionStorage.getItem("rolledItems");
        let rolledItems: RolledItems;
        if (rolledItemsString) {
            rolledItems = JSON.parse(rolledItemsString);
        } else {
            rolledItems = {
                weapons: [],
                armor: [],
                ashes: [],
                incantations: [],
                shields: [],
                sorceries: [],
                spirits: [],
                talismans: [],
                tears: [],
                seals: [],
            };
        }
        const keys = Object.keys(categoriesToIncludePreviouslyRolled);

        for (let i = 0; i < keys.length; ++i) {
            let key: string = keys[i];

            if (categoriesToIncludePreviouslyRolled[key]) {
                rolledItems[key] = [];
            }
        }

        sessionStorage.setItem("rolledItems", JSON.stringify(rolledItems));
        props.setIncludePreviouslyRolled(categoriesToIncludePreviouslyRolled);
    }, [category]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "90%",
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        width: 150,
                        textAlign: "center",
                        display: "flex",
                        ml: 2,
                        fontSize: "12px",
                        fontFamily: "Cormorant Garamond",
                    }}
                >
                    Include Previously Rolled
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 0,
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        displayEmpty
                        sx={{ height: "2rem", width: 100 }}
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
                    >
                        {categories.map((cat: string) => (
                            <MenuItem key={cat} value={cat}>
                                <Checkbox checked={category.indexOf(cat) > -1} />
                                <ListItemText primary={cat} />
                            </MenuItem>
                        ))}
                    </Select>
                    <Tooltip title={tooltipText}>
                        <IconButton sx={TOOLTIP_BUTTON_THEME}>
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
}
