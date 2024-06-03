import { Box, Typography } from "@mui/material";
import "../App.css";
const HEADER_THEME = {
	padding: "0.5rem",
	borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
	// textAlign: "center",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	maxWidth: "100%",
	// height: "35px",
	mb: 2,
	"@media (max-width: 750px)": {
		flexDirection: "column",
		justifyContent: "center",
		padding: "0",
		height: "60px",
	},
};

const TEXT_THEME = {
	fontFamily: "Cormorant Garamond",
	fontSize: "20px",
	"@media (max-width: 1200px)": {
		fontSize: "16px",
	},
	"@media (max-width: 750px)": {
		margin: 0,
		fontSize: "14px",
	},
};

export default function Header() {
	return (
		<Box sx={HEADER_THEME}>
			<Typography variant="h6" sx={{ ...TEXT_THEME, marginLeft: "2rem" }}>
				Elden Ring Build Generator
			</Typography>
			<Typography noWrap variant="h6" sx={{ ...TEXT_THEME, marginRight: "2rem" }}>
				⏳Check back soon for AI generated builds!
			</Typography>
		</Box>
	);
}
