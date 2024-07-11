import { useNavigate } from "react-router-dom";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BuildGenerator from "@/classes/BuildGenerator";
import { ItemCategory } from "@/types/enums";
import { BuildGenerationConfig } from "@/types/types";
import { themes } from "@/types/constants";

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
	// The current build generation configuration
	const [config, setConfig] = React.useState<BuildGenerationConfig>(generator._buildGenerationConfig);
	// The current value of the toggle button
	const [toggleValue, setToggleValue] = React.useState(true);
	// The current width of the window
	const [width, setWidth] = React.useState(window.innerWidth);

	// The navigate function from react-router-dom
	const navigate = useNavigate();
	// A regular expression to check if the current URL contains "/ai/"
	const regexp = new RegExp("/ai/*");

	/**
	 * Toggles the value of the excludePreviouslyRolled property for all categories
	 * in the build generation configuration.
	 *
	 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The click event.
	 */
	const toggleAll = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		const newConfig: BuildGenerationConfig = { ...config };
		for (const [c, _] of newConfig.buildInfo.categoryConfigs.entries()) {
			const currConfig = newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!;
			currConfig.excludePreviouslyRolled = toggleValue;
			!toggleValue && currConfig.previouslyRolled.clear();
		}

		setToggleValue(!toggleValue);
		setConfig(newConfig);
	};

	/**
	 * Toggles the value of the excludePreviouslyRolled property for a specific category
	 * in the build generation configuration.
	 *
	 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The click event.
	 * @param {ItemCategory} c - The category to toggle the excludePreviouslyRolled property for.
	 */
	function handleConfigChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>, c: ItemCategory) {
		e.preventDefault();
		const newConfig: BuildGenerationConfig = { ...config };

		newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled = !newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled;
		generator.setExcludePreviouslyRolledForCategory(c, newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled);
		setConfig(newConfig);
	}

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
			<div className="h-16 flex justify-center items-center w-60 lg:h-16 lg:w-52">
				<a className="h-full w-full flex justify-center items-center" href="https://www.buymeacoffee.com/bobbyrust" target="_blank" rel="noreferrer">
					<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=bobbyrust&button_colour=efb809&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" />
				</a>
			</div>

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
					onClick={regexp.test(window.location.href) ? () => navigate("/") : () => navigate("/ai")}>
					{regexp.test(window.location.href) ? "Randomizer" : "AI Builds"}
				</button>
			</li>

			{/* Render the Settings dropdown */}
			<li className="h-16 flex flex-nowrap justify-center items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="btn btn-ghost w-60 lg:w-28 tracking-widest flex flex-nowrap">
							<IoSettingsOutline /> Settings
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Exclude Previously Rolled</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem onClick={toggleAll}>Toggle All</DropdownMenuCheckboxItem>
						{/* Render checkbox items for each category */}
						{Object.values(ItemCategory).map((c) => (
							<DropdownMenuCheckboxItem
								key={c}
								onClick={(e) => handleConfigChange(e, c as ItemCategory)}
								checked={config.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled}>
								{c}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</li>

			{/* Render the theme selection dropdown */}
			<li className="h-16 flex justify-center items-center w-60 lg:w-28">
				<select className="select z-50 select-secondary select-bordered w-full" data-choose-theme data-theme value={theme} onChange={(e) => setTheme(e.target.value)}>
					<option disabled value="Select a theme">
						Select a theme
					</option>
					{/* Render options for each theme */}
					{themes.map((theme) => (
						<option key={theme} value={theme}>
							{theme}
						</option>
					))}
				</select>
			</li>
		</div>
	);
}
