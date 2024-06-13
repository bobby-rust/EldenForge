import { useNavigate } from "react-router-dom";

export default function DesktopNavbar({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
	const navigate = useNavigate();

	return (
		<div className="navbar min-w-[100vw] h-10 bg-slate-700 text-slate-100">
			<div className="flex-1">
				<a className="btn btn-ghost text-2xl">EldenForge</a>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<select
							className="select text-slate-700 focus:text-slate-100 focus:bg-slate-900 hover:text-slate-100 hover:bg-slate-900 select-bordered w-full"
							data-choose-theme
							data-theme="light"
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
					<li>
						<button className="btn btn-sm md:btn-lg ml-4 text-center mr-2" onClick={() => navigate("/ai")}>
							AI Builds
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
