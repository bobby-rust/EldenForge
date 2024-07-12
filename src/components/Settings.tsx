import { ItemCategory } from "@/types/enums";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BuildGenerationConfig } from "@/types/types";
import BuildGenerator from "@/classes/BuildGenerator";

export default function Settings(props: { generator: BuildGenerator }) {
	const { generator } = props;
	// The current build generation configuration
	const [config, setConfig] = React.useState<BuildGenerationConfig>(generator._buildGenerationConfig);
	// The current value of the toggle button
	const [toggleValue, setToggleValue] = React.useState(true);
	const [height, setHeight] = React.useState(window.innerHeight);

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

	// Update the width state whenever the window is resized
	React.useEffect(() => {
		function handleResize() {
			setHeight(window.innerHeight);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="btn btn-ghost w-60 lg:w-28 tracking-widest flex flex-nowrap">
					<IoSettingsOutline /> Settings
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className={`${height < 768 && "max-h-96"} w-56 overflow-y-scroll`}>
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
	);
}
