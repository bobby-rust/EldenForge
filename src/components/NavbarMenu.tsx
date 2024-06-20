import { useNavigate } from "react-router-dom";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import React from "react";
import { ToastMessage } from "./ToastMessage";
import { toast } from "sonner";
export default function NavbarMenu({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
	const [copied, setCopied] = React.useState(false);

	const navigate = useNavigate();
	const copyUrl = () => {
		const textToCopy = window.location.href;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		toast(
			<ToastMessage
				title="Copied!"
				message="The link has been copied to your clipboard."
				buttons={
					<button className="btn" onClick={() => toast.dismiss()}>
						Okay
					</button>
				}
			/>
		);
	};

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 4000);

		return () => clearInterval(timer);
	}, [copied]);

	const isAIPage = new RegExp("/ai/*");
	const isLandingPage = new RegExp("/$");
	return (
		<div className="flex flex-col lg:flex-row justify-center items-center overflow-hidden gap-4">
			<li className="h-16">
				{!isLandingPage.test(window.location.href) && (
					<button onClick={copyUrl} className="h-full btn btn-sm btn-secondary w-36">
						{copied ? <LuCopyCheck /> : <IoCopyOutline />}
						Copy Build URL
					</button>
				)}
			</li>
			<li className="h-16">
				{!isLandingPage.test(window.location.href) && (
					<button
						className="btn btn-sm btn-secondary w-36 text-center h-full"
						onClick={isAIPage.test(window.location.href) ? () => navigate("/") : () => navigate("/ai")}
					>
						{isAIPage.test(window.location.href) ? "Random Builds" : "AI Generated Builds"}
					</button>
				)}
			</li>
			<li className="h-16 flex items-center justify-center">
				<select
					className="select z-50 select-secondary select-bordered w-full overflow-hidden"
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
