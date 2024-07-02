import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import NavbarMenu from "./NavbarMenu";
import BuildGenerator from "@/classes/BuildGenerator";

export default function Navbar(props: { generator: BuildGenerator }) {
	const { generator } = props;

	const themeContext = useContext(ThemeContext);
	if (!themeContext) {
		throw new Error("ThemeContext is undefined");
	}
	const { theme, setTheme } = themeContext;

	return (
		<div className="drawer z-10 font-['Cormorant_Garamond']">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Navbar */}
				<div className="w-full navbar lg:justify-between bg-base-300 h-20">
					<div className="flex-none lg:hidden">
						<label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-6 h-6 stroke-current"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</label>
					</div>
					<a className="px-2 flex flex-col mx-2 w-40 text-2xl font-semibold" href="/">
						<div className="text-center">EldenForge</div>
						<div className="text-xs font-normal">Made with ❤️ by Bobby Rust</div>
					</a>
					{/* <div className="flex-none hidden lg:block"> */}
					<div className="flex-none hidden lg:block">
						<ul className="menu menu-horizontal">
							{/* Navbar menu content here */}
							<NavbarMenu generator={generator} theme={theme} setTheme={setTheme} />
						</ul>
					</div>
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu p-4 w-72 min-h-full bg-base-200">
					{/* Sidebar content here */}
					<NavbarMenu generator={generator} theme={theme} setTheme={setTheme} />
				</ul>
			</div>
		</div>
	);
}
