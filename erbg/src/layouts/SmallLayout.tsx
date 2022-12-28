import Button from "react-bootstrap/Button";
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
import SelectMenu from "../components/SelectMenu";
import { Box, Grid } from "@mui/material";

function SmallLayout(props: any) {
    console.log(props.build);
    return (
        <div className='layout-wrapper-sm'>
            <Box>
                <Grid container spacing={1} direction='row' columns={12}>
                    <Grid item xs={12} xl={12}>
                        <div className='form-container'>
                            <SelectMenu
                                buildNums={props.buildNums}
                                buildNumsDispatch={props.buildNumsDispatch}
                            />
                            <StartingClass
                                starting_class={props.build["starting_class"]}
                                size={props.size}
                            />
                            <Button
                                className='button-sm'
                                onClick={props.generateNewBuild}
                                variant='danger'>
                                GENERATE NEW BUILD
                            </Button>
                        </div>
                    </Grid>
                </Grid>
                <Grid container direction='row' columns={16} spacing={2}>
                    <Grid item xs={2}>
                        <div className='weapons-container'>
                            <Weapons
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <Armors
                            build={props.build}
                            color={props.color}
                            size={props.size}
                            buildDispatch={props.buildDispatch}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Shield
                            build={props.build}
                            color={props.color}
                            size={props.size}
                            buildDispatch={props.buildDispatch}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <div className='sorcs-container'>
                            <Sorceries
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='incants-container'>
                            <Incantations
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='talis-container'>
                            <Talismans
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='ashes-container'>
                            <Ashes
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='spirits-container'>
                            <Spirits
                                build={props.build}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default SmallLayout;
