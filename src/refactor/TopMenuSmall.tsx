import { Box, Button, Typography } from "@mui/material";
import IncludePreviouslyRolledMenu from "../components/IncludePreviouslyRolledMenu";

const TOP_MENU_CONTAINER_THEME = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90vw",
    flexDirection: "column",
};

const BOX_THEME = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
};

const BUTTON_THEME = {
    fontFamily: "Cormorant Garamond",
    color: "rgba(232, 182, 8, 1)",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
    p: 1,
    width: "40vw",
    borderColor: "rgba(0, 0, 0, 0.1)",
    "&:hover": {
        borderColor: "rgba(232, 182, 8, 1)",
        boxShadow: 1,
    },
    "@media (max-width:431px)": {
        minWidth: "173px",
    },
};

const TYPOGRAPHY_THEME = {
    fontFamily: "Cormorant Garamond",
    fontSize: "12px",
    maxWidth: "50%",
    textAlign: "center",
};

export default function TopMenuSmall(props: any) {
    return (
        <Box sx={TOP_MENU_CONTAINER_THEME}>
            <Box sx={{ ...BOX_THEME, mb: 2 }}>
                <Button
                    variant="outlined"
                    sx={BUTTON_THEME}
                    onClick={() => props.buildDispatch({ type: "FULLBUILD" })}
                >
                    Generate New Build
                </Button>
            </Box>
            <Box sx={{ ...BOX_THEME, justifyContent: "space-evenly" }}>
                {/* <Typography variant="body1" sx={TYPOGRAPHY_THEME}>
                    Select to Include Previously Rolled
                </Typography> */}
                <IncludePreviouslyRolledMenu
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="body1" sx={TYPOGRAPHY_THEME}>
                        Class:{" "}
                    </Typography>
                    <img
                        style={props.IMG_THEME}
                        src="https://eldenring.fanapis.com/images/classes/17f69d71826l0i32gkm3ndn3kywxqj.png"
                        alt="class img"
                    />
                </Box>
            </Box>
        </Box>
    );
}
