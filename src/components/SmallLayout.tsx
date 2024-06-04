import { Box } from "@mui/material";
import TopMenu from "./TopMenu";
import ItemGrid from "./ItemGrid";

const CONTAINER_THEME = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	margin: "1rem",
};

export default function SmallLayout(props: any) {
	return (
		<>
			<Box sx={CONTAINER_THEME}>
				<TopMenu
					includePreviouslyRolled={props.includePreviouslyRolled}
					setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
					buildDispatch={props.buildDispatch}
					build={props.build.startingClass}
				/>
				<ItemGrid
					build={props.build}
					buildDispatch={props.buildDispatch}
					buildNums={props.buildNums}
					buildNumsDispatch={props.buildNumsDispatch}
				/>
			</Box>
		</>
	);
}