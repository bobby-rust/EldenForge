import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import "../styles/header.css";
import {
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
} from "@mui/material";

type IncludeCategories = {
    armors: boolean;
    ashes: boolean;
    incantations: boolean;
    shields: boolean;
    sorceries: boolean;
    spirits: boolean;
    talismans: boolean;
    weapons: boolean;
    [key: string]: boolean;
};

type ResponsiveAppBarProps = {
    includePreviouslyRolled: IncludeCategories;
    setIncludePreviouslyRolled: React.Dispatch<React.SetStateAction<IncludeCategories>>;
};

function ResponsiveAppBar(props: ResponsiveAppBarProps) {
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

    const categories: string[] = [
        "Weapons",
        "Armor",
        "Ashes",
        "Incantations",
        "Sorceries",
        "Spirits",
        "Talismans",
        "Shields",
    ];

    let categoriesToIncludePreviouslyRolled: IncludeCategories = {
        armors: false,
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

        console.log("calling setCategory");
        setCategory(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );

        for (let i = 0; i < category.length; i++) {
            const currCat: string = category[i].toLowerCase();
            categoriesToIncludePreviouslyRolled[currCat] = true;
        }
        console.log("calling setIncludePreviouslyRolled");
        props.setIncludePreviouslyRolled(categoriesToIncludePreviouslyRolled);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="static"
                sx={{
                    mb: "15px",
                    boxShadow: "none",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
                    backgroundColor: "white",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <InputLabel id="demo-multiple-checkbox-label">
                        Select to include previously rolled
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        displayEmpty
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
                        sx={{
                            width: "100",
                            height: "2rem",
                            // maxWidth: "10em",
                            maxWidth: 100,
                            overflow: "hidden",
                        }}
                    >
                        {categories.map((cat: string) => (
                            <MenuItem key={cat} value={cat}>
                                <Checkbox checked={category.indexOf(cat) > -1} />
                                <ListItemText primary={cat} />
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                {/* <Container
                    maxWidth="xl"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // width: "100vw",
                        height: "100%",
                    }}
                > */}
                <a
                    id="logo-anchor"
                    href="/"
                    style={{ textDecoration: "none", color: "#ef8b09 !important" }}
                >
                    <div
                        style={{
                            margin: 0,
                            width: "100px",
                            justifyContent: "center",
                            alignItems: "center",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: "0.6rem",
                            color: "#ef8b09 !important",
                            textDecoration: "none",
                            textAlign: "center",
                            position: "absolute",
                        }}
                    >
                        ERBG
                    </div>
                </a>
            </AppBar>
        </Box>
    );
}
export default ResponsiveAppBar;
