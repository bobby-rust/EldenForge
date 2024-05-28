import React from "react";

const linkStyles = { color: "#0056B3" };

export default function Footer() {
	const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1300);
	const footerContainerStyles = {
		display: "flex",
		padding: "1rem",
		justifyContent: "center",
		alignItems: isMobile ? "center" : "stretch",
		flexDirection: isMobile ? ("column" as "column") : ("row" as "row"),
	};

	const bmacStyles = {
		position: !isMobile ? ("absolute" as "absolute") : ("static" as "static"),
		marginRight: !isMobile ? "72vw" : "0",
	};

	React.useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1300);
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	React.useEffect(() => {
		console.log("mobile is ", isMobile);
	}, [isMobile]);

	return (
		<div style={footerContainerStyles}>
			<p
				style={{
					fontSize: "20px",
					textAlign: "center",
					maxWidth: "50vw",
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
			<a style={bmacStyles} href="https://www.buymeacoffee.com/bobbyrust" target="_blank" rel="noreferrer">
				<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=bobbyrust&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" />
			</a>
		</div>
	);
}
