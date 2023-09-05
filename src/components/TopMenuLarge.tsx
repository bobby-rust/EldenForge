import { Box, Button, Typography } from "@mui/material";
import IncludePreviouslyRolledMenu from "../components/IncludePreviouslyRolledMenu";

const TOP_MENU_CONTAINER_THEME = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90vw",
    mt: 1,
    height: "30px",
};

const BOX_THEME = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20vw",
};

const BUTTON_THEME = {
    fontFamily: "Cormorant Garamond",
    color: "rgba(232, 182, 8, 1)",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
    p: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "20vw",
    "&:hover": {
        borderColor: "rgba(232, 182, 8, 1)",
        boxShadow: 1,
    },
};

export default function TopMenuLarge(props: any) {
    return (
        <Box sx={TOP_MENU_CONTAINER_THEME}>
            <Box sx={BOX_THEME}>
                <IncludePreviouslyRolledMenu
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                />
            </Box>

            <Box sx={BOX_THEME}>
                <Button
                    variant="outlined"
                    sx={BUTTON_THEME}
                    onClick={() => props.buildDispatch({ type: "FULLBUILD" })}
                >
                    Generate New Build
                </Button>
            </Box>
            <Box sx={BOX_THEME}>
                <Typography variant="body1" sx={{ fontFamily: "Cormorant Garamond" }}>
                    Class:{" "}
                </Typography>
                <img style={props.IMG_THEME} src={props.build.image} alt="starting class" />
            </Box>
        </Box>
    );
}
