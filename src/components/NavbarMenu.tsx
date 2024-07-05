import { useNavigate } from "react-router-dom";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BuildGenerator from "@/classes/BuildGenerator";
import { ItemCategory } from "@/types/enums";
import { BuildGenerationConfig } from "@/types/types";

export default function NavbarMenu({
	generator,
	theme,
	setTheme,
}: {
	generator: BuildGenerator;
	theme: string;
	setTheme: (theme: string) => void;
}) {
	const [config, setConfig] = React.useState<BuildGenerationConfig>(generator._buildGenerationConfig);
	const [toggleValue, setToggleValue] = React.useState(true);
	const [width, setWidth] = React.useState(window.innerWidth);

	const navigate = useNavigate();
	const regexp = new RegExp("/ai/*");

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

	function handleConfigChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>, c: ItemCategory) {
		e.preventDefault();
		const newConfig: BuildGenerationConfig = { ...config };

		newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled =
			!newConfig.buildInfo.categoryConfigs.get(c as ItemCategory)!.excludePreviouslyRolled;
		setConfig(newConfig);
	}

	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			className={`flex flex-col lg:flex-row flex-wrap justify-center items-center gap-4 ${
				width < 1032 ? "flex-col-reverse" : ""
			}`}
		>
			<li className="h-16 flex text-nowrap justify-center items-center">
				<button
					className="btn btn-ghost text-center w-60 lg:w-auto tracking-widest font-semibold"
					onClick={() => navigate("/item-dashboard")}
				>
					Item Dashboard
				</button>
			</li>

			<div className="h-16 flex justify-center items-center w-60 lg:h-16 lg:w-52">
				<a href="https://www.buymeacoffee.com/bobbyrust" target="_blank" rel="noreferrer">
					<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=bobbyrust&button_colour=efb809&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" />
				</a>
			</div>
			<li className="h-16 flex justify-center items-center">
				<button
					className="btn btn-ghost text-center w-60 lg:w-28 tracking-widest font-semibold"
					onClick={regexp.test(window.location.href) ? () => navigate("/") : () => navigate("/ai")}
				>
					{regexp.test(window.location.href) ? "Randomizer" : "AI Builds"}
				</button>
			</li>
			<li className="h-16 justify-center items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="btn btn-ghost w-60 lg:w-28 tracking-widest">
							<IoSettingsOutline /> Settings
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Exclude Previously Rolled</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem onClick={toggleAll}>Toggle All</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Weapons)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Weapons)!.excludePreviouslyRolled}
						>
							Weapons
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Ashes)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Ashes)!.excludePreviouslyRolled}
						>
							Ashes Of War
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Seals)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Seals)!.excludePreviouslyRolled}
						>
							Sacred Seals
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Sorcs)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Sorcs)!.excludePreviouslyRolled}
						>
							Sorceries
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Incants)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Incants)!.excludePreviouslyRolled}
						>
							Incantations
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Shields)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Shields)!.excludePreviouslyRolled}
						>
							Shields
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Tears)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Tears)!.excludePreviouslyRolled}
						>
							Crystal Tears
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Spirits)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Spirits)!.excludePreviouslyRolled}
						>
							Spirit Ashes
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							onClick={(e) => handleConfigChange(e, ItemCategory.Talismans)}
							checked={config.buildInfo.categoryConfigs.get(ItemCategory.Talismans)!.excludePreviouslyRolled}
						>
							Talismans
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</li>
			<li className="h-16 flex justify-center items-center w-60 lg:w-28">
				<select
					className="select z-50 select-secondary select-bordered w-full"
					data-choose-theme
					data-theme
					value={theme}
					onChange={(e) => setTheme(e.target.value)}
				>
					<option disabled value="Select a theme">
						Select a theme
					</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="cupcake">Cupcake</option>
					<option value="bumblebee">Bumblebee</option>
					<option value="emerald">Emerald</option>
					<option value="corporate">Corporate</option>
					<option value="synthwave">Synthwave</option>
					<option value="retro">Retro</option>
					<option value="cyberpunk">Cyberpunk</option>
					<option value="valentine">Valentine</option>
					<option value="halloween">Halloween</option>
					<option value="garden">Garden</option>
					<option value="forest">Forest</option>
					<option value="aqua">Aqua</option>
					<option value="lofi">Lofi</option>
					<option value="pastel">Pastel</option>
					<option value="fantasy">Fantasy</option>
					<option value="wireframe">Wireframe</option>
					<option value="black">Black</option>
					<option value="luxury">Luxury</option>
					<option value="dracula">Dracula</option>
					<option value="cmyk">Cmyk</option>
					<option value="autumn">Autumn</option>
					<option value="business">Business</option>
					<option value="acid">Acid</option>
					<option value="lemonade">Lemonade</option>
					<option value="night">Night</option>
					<option value="coffee">Coffee</option>
					<option value="winter">Winter</option>
					<option value="dim">Dim</option>
					<option value="nord">Nord</option>
					<option value="sunset">Sunset</option>
				</select>
			</li>
		</div>
	);
}
