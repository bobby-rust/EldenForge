import { themes } from "../types/constants";

export default function Themes(props: { theme: string; setTheme: (theme: string) => void }) {
	const { theme, setTheme } = props;
	return (
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
	);
}
