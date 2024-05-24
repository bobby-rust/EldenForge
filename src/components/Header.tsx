import { Box, Typography } from "@mui/material";
import React from "react";

const HEADER_THEME = {
	borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
	textAlign: "center",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	// boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.2)",
	width: "100%",
	height: "35px",
	mb: 2,
	// fontSize: "20px",
};

export default function Header() {
	return (
		<Box sx={HEADER_THEME}>
			<Typography variant="h6" sx={{ fontFamily: "Cormorant Garamond" }}>
				Elden Ring Build Generator
			</Typography>
		</Box>
	);
}
