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
import { RolledItems } from "../types/ItemTypes";
import IncludePreviouslyRolledMenu from "./IncludePreviouslyRolledMenu";

function ResponsiveAppBar(props: any) {
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
                {/* <IncludePreviouslyRolledMenu
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                /> */}
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
