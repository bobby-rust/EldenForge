import Button from "@mui/material/Button";
import StartingClass from "../components/StartingClass";
import Weapons from "../components/Weapons";
import Armors from "../components/Armors";
import Shield from "../components/Shield";
import Talismans from "../components/Talismans";
import Incantations from "../components/Incantations";
import Sorceries from "../components/Sorceries";
import Ashes from "../components/Ashes";
import Spirits from "../components/Spirits";
import "../styles/smallLayout.css";
import "../styles/chatGPTStyles.css";
import SelectMenu from "../components/SelectMenu";
import { Box, Grid } from "@mui/material";

function SmallLayout(props: any) {
    return (
        <>
            <div className="layout-wrapper-sm">
                <Box sx={{ height: "80vh", width: "90vw" }}>
                    <Box sx={{ width: 1 / 1, flex: 1 }}>
                        <div className="top-grid-container">
                            <Grid container spacing={0} direction="row" padding={0} columns={8}>
                                <Grid item sm={2} md={8} lg={8} sx={{ p: 0 }}>
                                    <div className="form-container">
                                        <Button
                                            className="button-sm"
                                            onClick={() =>
                                                props.buildDispatch({ type: "FULLBUILD" })
                                            }
                                            sx={{
                                                color: "#ef8b09",
                                                border: "1px solid rgba(0, 0, 0, 0.2)",
                                                boxShadow: 1,
                                            }}
                                        >
                                            GENERATE NEW BUILD
                                        </Button>
                                        <StartingClass
                                            starting_class={props.build["starting_class"]}
                                            size={props.size}
                                        />
                                        <SelectMenu
                                            buildNums={props.buildNums}
                                            buildNumsDispatch={props.buildNumsDispatch}
                                            includePreviouslyRolled={props.includePreviouslyRolled}
                                            setIncludePreviouslyRolled={
                                                props.setIncludePreviouslyRolled
                                            }
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Box>
                    <Box sx={{ width: 1.0 / 1, m: "auto", flex: 1 }}>
                        <div className="bottom-div-container" style={{ marginTop: "20px" }}>
                            <Grid container direction="row" columns={8} spacing={6}>
                                <Grid item xs={4} md={1}>
                                    <div className="armor-container">
                                        <Armors
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="weapons-container">
                                        <Weapons
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="sorcs-container">
                                        <Sorceries
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="incants-container">
                                        <Incantations
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="ashes-container">
                                        <Ashes
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="talis-container">
                                        <Talismans
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="spirits-container">
                                        <Spirits
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={4} md={1}>
                                    <div className="shield-container">
                                        <Shield
                                            build={props.build}
                                            color={props.color}
                                            size={props.size}
                                            buildDispatch={props.buildDispatch}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Box>
                </Box>
            </div>
            {/* <DevMessage /> */}
        </>
    );
}

export default SmallLayout;
