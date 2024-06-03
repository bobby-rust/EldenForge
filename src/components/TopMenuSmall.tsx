import { Box, Button, CircularProgress, Typography } from "@mui/material";
import IncludePreviouslyRolledMenu from "../components/IncludePreviouslyRolledMenu";
import { useState, useEffect } from "react";

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
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageLoaded(false);
    }, [props.build.id]);
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
                <IncludePreviouslyRolledMenu
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="body1" sx={TYPOGRAPHY_THEME}>
                        Class:{" "}
                    </Typography>
                    <img
                        style={{ ...props.IMG_THEME, display: imageLoaded ? "block" : "none" }}
                        src={props.build.image}
                        alt="starting class"
                        onLoad={() => setImageLoaded(true)}
                    />
                    {imageLoaded ? null : (
                        <CircularProgress sx={{ marginLeft: "5px", color: "rgba(0, 0, 0, 0.5)" }} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
