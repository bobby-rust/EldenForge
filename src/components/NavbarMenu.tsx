import { useNavigate } from "react-router-dom";
import React from "react";
export default function NavbarMenu({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
	const navigate = useNavigate();

	const regexp = new RegExp("/ai/*");

	const [width, setWidth] = React.useState(window.innerWidth);
	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return (
		<div
			className={`flex flex-col lg:flex-row justify-center items-center overflow-hidden gap-4 ${
				width < 1032 ? "flex-col-reverse" : ""
			}`}
		>
			<div>
				<a href="https://www.buymeacoffee.com/bobbyrust" target="_blank" rel="noreferrer">
					<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=bobbyrust&button_colour=efb809&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" />
				</a>
			</div>
			<li className="h-16">
				<button
					className="btn btn-lg btn-secondary ml-4 text-center mr-2 h-full"
					onClick={regexp.test(window.location.href) ? () => navigate("/") : () => navigate("/ai")}
				>
					{regexp.test(window.location.href) ? "Random Builds" : "AI Builds"}
				</button>
			</li>
			<li className="h-16">
				<select
					className="select z-50 select-secondary select-lg select-bordered w-full"
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
