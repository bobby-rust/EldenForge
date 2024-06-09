import React from "react";

export default function Navbar({
	handleChangeTheme,
}: {
	handleChangeTheme: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
	return (
		<div className="navbar h-10 bg-slate-900 text-slate-100">
			<div className="flex-1">
				<a className="btn btn-ghost text-2xl">EldenForge</a>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<select className="select select-bordered w-full max-w-xs" data-choose-theme onChange={handleChangeTheme}>
							<option disabled selected>
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
						<a>Link</a>
					</li>
					<li>
						<details>
							<summary>Parent</summary>
							<ul className="p-2 bg-base-100 rounded-t-none">
								<li>
									<a>Link 1</a>
								</li>
								<li>
									<a>Link 2</a>
								</li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		</div>
	);
}
