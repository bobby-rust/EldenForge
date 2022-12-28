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
                                items={props.build["weapons"]}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <Armors
                            items={props.build["armor"]}
                            color={props.color}
                            size={props.size}
                            buildDispatch={props.buildDispatch}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Shield
                            items={props.build["shields"]}
                            color={props.color}
                            size={props.size}
                            buildDispatch={props.buildDispatch}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <div className='sorcs-container'>
                            <Sorceries
                                items={props.build["sorcs"]}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='incants-container'>
                            <Incantations
                                items={props.build["incants"]}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='talis-container'>
                            <Talismans
                                items={props.build["talismans"]}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='ashes-container'>
                            <Ashes
                                items={props.build["ashes"]}
                                color={props.color}
                                size={props.size}
                                buildDispatch={props.buildDispatch}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className='spirits-container'>
                            <Spirits
                                items={props.build["spirits"]}
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
