import React from "react";

const linkStyles = { textDecoration: "none" };

export default function Footer() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				padding: "1rem",
			}}
		>
			<p
				style={{
					fontSize: "20px",
					textAlign: "center",
				}}
			>
				<b>I value your feedback!</b> If you have any comments, suggestions, or issues, please don't hesitate to reach
				out. You can open an issue on GitHub{"  "}
				<a style={linkStyles} href="https://github.com/bobby-rust/erbg/issues" rel="noreferrer" target="_blank">
					here
				</a>{" "}
				{"  "}
				or send me an email at{" "}
				<a style={linkStyles} href="mailto:erbgfeedback@gmail.com" rel="noreferrer" target="_blank">
					erbgfeedback@gmail.com
				</a>
				.
			</p>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0rem" }}>
				<a href="https://www.buymeacoffee.com/bobbyrust">
					<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=bobbyrust&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" />
				</a>
			</div>
		</div>
	);
}
