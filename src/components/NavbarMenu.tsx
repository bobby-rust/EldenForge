import { useNavigate } from "react-router-dom";
import React from "react";
import BuildGenerator from "@/classes/BuildGenerator";
import { defaultBuildGenerationConfig } from "@/types/types";
import { toast } from "sonner";
import Settings from "./Settings";
import BMAC from "./BMAC";
import Themes from "./Themes";

/**
 * The NavbarMenu component displays a menu with various options for the user.
 * It allows the user to navigate to different pages, change the theme, and change
 * settings related to the build generation process.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {BuildGenerator} props.generator - The build generator instance.
 * @param {string} props.theme - The current theme.
 * @param {function} props.setTheme - The function to set the theme.
 * @returns {JSX.Element} The rendered NavbarMenu component.
 */
export default function NavbarMenu({ generator, theme, setTheme }: { generator: BuildGenerator; theme: string; setTheme: (theme: string) => void }) {
	// The current width of the window
	const [width, setWidth] = React.useState(window.innerWidth);

	// The navigate function from react-router-dom
	const navigate = useNavigate();
	// A regular expression to check if the current URL contains "/ai/"
	const regexp = new RegExp("/ai/*");

	const navigateTo = (path: string) => {
		generator._buildGenerationConfig = structuredClone(defaultBuildGenerationConfig);
		generator._baseGameItems = generator.initBaseGameItems();
		generator._dlcItems = generator.initDlcItems();

		toast.dismiss();
		navigate(path);
	};

	// Update the width state whenever the window is resized
	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className={`flex flex-col lg:flex-row flex-wrap justify-center items-center gap-4 ${width < 1032 ? "flex-col-reverse" : ""}`}>
			{/* Render the Buy me a coffee button */}
			<BMAC />

			{/* Render the Item Dashboard button */}
			{/* <li className="h-16 flex text-nowrap justify-center items-center">
				<button
					className="btn btn-ghost text-center w-60 lg:w-auto tracking-widest font-semibold"
					onClick={() => navigate("/item-dashboard")}
				>
					Item Dashboard
				</button>
			</li> */}

			{/* Render the Randomizer/AI Builds button */}
			<li className="h-16 flex justify-center items-center">
				<button
					className="btn btn-ghost text-center w-60 lg:w-28 tracking-widest font-semibold"
					onClick={regexp.test(window.location.href) ? () => navigateTo("/") : () => navigateTo("/ai")}>
					{regexp.test(window.location.href) ? "Randomizer" : "AI Builds"}
				</button>
			</li>

			{/* Render the Settings dropdown */}
			<li className="h-16 flex flex-nowrap justify-center items-center">
				<Settings generator={generator} />
			</li>

			{/* Render the theme selection dropdown */}
			<li className="h-16 flex justify-center items-center w-60 lg:w-28">
				<Themes theme={theme} setTheme={setTheme} />
			</li>
		</div>
	);
}
