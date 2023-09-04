import { Box, Grid } from "@mui/material";
import ItemColumn from "./ItemColumn";

const GRID_CONTAINER_THEME = {
    display: "flex",
    justifyContent: "center",
    width: "90vw",
    m: 1,
};
export default function ItemGrid(props: any) {
    return (
        <Box sx={GRID_CONTAINER_THEME}>
            <Grid container spacing={0} direction="row" padding={0} columns={8} mt={1}>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"armor"}
                        build={props.build.armor}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"weapons"}
                        build={props.build.weapons}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"sorceries"}
                        build={props.build.sorceries}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"incantations"}
                        build={props.build.incantations}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"ashes"}
                        build={props.build.ashes}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"talismans"}
                        build={props.build.talismans}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"spirits"}
                        build={props.build.spirits}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
                <Grid item xs={4} sm={2} lg={1}>
                    <ItemColumn
                        buildNums={props.buildNums}
                        buildNumsDispatch={props.buildNumsDispatch}
                        itemType={"shields"}
                        build={props.build.shields}
                        buildDispatch={props.buildDispatch}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
