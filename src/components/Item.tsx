import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const ITEM_THEME = {
	textAlign: "center",
	fontSize: "0.75rem",
	border: "1px solid black",
	borderColor: "rgba(0, 0, 0, 0.5)",
	borderRadius: "5px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	m: 0.5,
	p: 1,
	height: "150px",
	"@media (min-width:0px)": {
		width: "40vw",
	},
	"@media (min-width:600px)": {
		width: "20vw",
	},
	"@media (min-width:1200px)": {
		width: "10vw",
		minWidth: "130px",
		height: "150px",
	},
	"@media (min-width:1900px)": {
		height: "175px",
	},
	"&:hover": {
		boxShadow: 1,
	},
};

const IMG_THEME = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "75px",
	width: "75px",
};

const BUTTON_THEME = {
	fontFamily: "Cormorant Garamond",
	color: "rgba(232, 182, 8, 1)",
	backgroundColor: "rgba(0, 0, 0, 0.01)",
	p: 1,
	border: "1px solid rgba(0, 0, 0, 0.1)",
	width: "50%",
	height: "30px",
	mt: 1,
	"&:hover": {
		borderColor: "rgba(232, 182, 8, 1)",
	},
};

const ANCHOR_STYLES = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	textDecoration: "none",
	color: "black",
	maxWidth: "100%",
};

export default function Item(props: any) {
	const [imageLoaded, setImageLoaded] = useState(false);

	const type = props.itemType;
	let name = props.item.name;

	// Two ashes of war have names that do not fit the structure of the rest
	let ashName;
	if (type === "ashes") {
		let nameArr = props.item.name.split(" ");
		if (nameArr[0] !== "Lost" && nameArr[0] !== "Through") {
			ashName = props.item.name.split("Ash Of War: ")[1];
		}
	}

	if (!(typeof ashName === "undefined")) name = ashName;

	useEffect(() => {
		setImageLoaded(false);
	}, [props.item.id]);

	return (
		<>
			<Box sx={ITEM_THEME}>
				<a
					style={ANCHOR_STYLES}
					href={`https://eldenring.wiki.fextralife.com/${props.item.name.replaceAll(" ", "+")}`}
					target="_blank"
					rel="noreferrer"
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<div
							style={{
								whiteSpace: "nowrap",
								maxWidth: "125px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								padding: "5px",
							}}
						>
							{name}
						</div>
						<Box sx={IMG_THEME}>
							<img
								src={props.item.image}
								alt={props.item.name}
								style={{
									...IMG_THEME,
									display: imageLoaded ? "block" : "none",
								}}
								onLoad={() => setImageLoaded(true)}
							/>
							{imageLoaded ? null : <CircularProgress sx={{ color: "rgba(0, 0, 0, 0.5)" }} />}
						</Box>
					</Box>
				</a>
				<Button
					sx={BUTTON_THEME}
					onClick={() => {
						props.buildDispatch({
							id: props.item.id,
							type: props.itemType.toUpperCase(),
						});
					}}
				>
					Reroll
				</Button>
			</Box>
		</>
	);
}
