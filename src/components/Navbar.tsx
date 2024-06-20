import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import NavbarMenu from "./NavbarMenu";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const themeContext = useContext(ThemeContext);
	if (!themeContext) {
		throw new Error("ThemeContext is undefined");
	}
	const { theme, setTheme } = themeContext;

	const navigate = useNavigate();

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
					<button
						className="btn btn-ghost px-2 mx-2 w-36 text-2xl font-semibold"
						onClick={() => navigate("/", { replace: true, state: { toLanding: true } })}
					>
						EldenForge
					</button>
					{/* <div className="flex-none hidden lg:block"> */}
					<div className="flex-none hidden lg:block">
						<ul className="menu menu-horizontal">
							{/* Navbar menu content here */}
							<NavbarMenu theme={theme} setTheme={setTheme} />
						</ul>
					</div>
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200 overflow-hidden">
					{/* Sidebar content here */}
					<NavbarMenu theme={theme} setTheme={setTheme} />
				</ul>
			</div>
		</div>
	);
}
